import { prisma } from '@/lib/prisma';
import { AccountAdmissionError } from './errors';
import { isValidAccountEmail, normalizeAccountEmail } from './policy';
import { accountAdmissionSecretLink, createOpaqueToken, hashOpaqueToken, maskEmail } from './tokens';

const DEFAULT_INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export type PublicInvitationView = {
  id: string;
  status: 'pending' | 'accepted' | 'revoked' | 'expired' | 'invalid';
  email: string | null;
  maskedEmail: string | null;
  role: string | null;
  organizationName: string | null;
  expiresAt: string | null;
};

export async function expirePendingInvitations(now = new Date()): Promise<number> {
  const result = await prisma.accountInvitation.updateMany({
    where: {
      status: 'PENDING',
      expiresAt: { lte: now },
    },
    data: {
      status: 'EXPIRED',
      activeForEmail: null,
      tokenHash: null,
    },
  });
  return result.count;
}

export async function inspectAccountInvitation(
  token: string,
  now = new Date()
): Promise<PublicInvitationView> {
  const cleanToken = token.trim();
  if (!cleanToken) {
    return {
      id: '',
      status: 'invalid',
      email: null,
      maskedEmail: null,
      role: null,
      organizationName: null,
      expiresAt: null,
    };
  }

  const tokenHash = hashOpaqueToken(cleanToken);
  const invitation = await prisma.accountInvitation.findUnique({
    where: { tokenHash },
    include: {
      organization: { select: { name: true } },
    },
  });

  if (!invitation) {
    return {
      id: '',
      status: 'invalid',
      email: null,
      maskedEmail: null,
      role: null,
      organizationName: null,
      expiresAt: null,
    };
  }

  if (invitation.status === 'PENDING' && invitation.expiresAt <= now) {
    await prisma.accountInvitation.updateMany({
      where: { id: invitation.id, status: 'PENDING', tokenHash },
      data: {
        status: 'EXPIRED',
        activeForEmail: null,
        tokenHash: null,
      },
    });
    return {
      id: invitation.id,
      status: 'expired',
      email: invitation.email,
      maskedEmail: maskEmail(invitation.email),
      role: invitation.role,
      organizationName: invitation.organization?.name ?? null,
      expiresAt: invitation.expiresAt.toISOString(),
    };
  }

  return {
    id: invitation.id,
    status: invitation.status.toLowerCase() as PublicInvitationView['status'],
    email: invitation.email,
    maskedEmail: maskEmail(invitation.email),
    role: invitation.role,
    organizationName: invitation.organization?.name ?? null,
    expiresAt: invitation.expiresAt.toISOString(),
  };
}

export async function createAccountInvitation(input: {
  email: string;
  role?: string;
  invitedById: string;
  organizationId: string;
  expiresAt?: Date;
}) {
  const normalizedEmail = normalizeAccountEmail(input.email);
  if (!isValidAccountEmail(input.email)) {
    throw new AccountAdmissionError(400, 'invalid_email', 'Enter a valid email address.');
  }

  const now = new Date();
  const expiresAt = input.expiresAt ?? new Date(now.getTime() + DEFAULT_INVITATION_TTL_MS);
  if (expiresAt.getTime() <= now.getTime()) {
    throw new AccountAdmissionError(
      400,
      'invalid_expiry',
      'Invitation expiry must be in the future.'
    );
  }

  await expirePendingInvitations(now);

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: { passwordCredential: { select: { id: true } } },
  });
  if (
    existingUser &&
    existingUser.status === 'active' &&
    (existingUser.passwordHash || existingUser.passwordCredential)
  ) {
    throw new AccountAdmissionError(
      409,
      'already_member',
      'A Clueso account already exists for this email.'
    );
  }

  const activeInvite = await prisma.accountInvitation.findUnique({
    where: { activeForEmail: normalizedEmail },
    select: { id: true },
  });
  if (activeInvite) {
    throw new AccountAdmissionError(
      409,
      'invitation_exists',
      'An active invitation already exists for this email. Rotate or revoke it below.'
    );
  }

  const token = createOpaqueToken();
  const tokenHash = hashOpaqueToken(token);
  const role = input.role || 'Editor';

  const invitation = await prisma.accountInvitation.create({
    data: {
      email: input.email.trim(),
      normalizedEmail,
      activeForEmail: normalizedEmail,
      tokenHash,
      status: 'PENDING',
      role,
      organizationId: input.organizationId,
      invitedById: input.invitedById,
      expiresAt,
      emails: {
        create: {
          status: 'pending',
          expiresAt,
          payload: JSON.stringify({
            type: 'account_invitation',
            to: normalizedEmail,
            role,
            invitePath: accountAdmissionSecretLink('/invite', token),
          }),
        },
      },
    },
    include: {
      invitedBy: { select: { id: true, name: true, email: true } },
      acceptedBy: { select: { id: true, name: true, email: true } },
    },
  });

  await prisma.auditLog.create({
    data: {
      action: 'admin.account_invitation.create',
      actorId: input.invitedById,
      targetType: 'account_invitation',
      targetId: invitation.id,
      organizationId: input.organizationId,
      metadataJson: JSON.stringify({
        email: normalizedEmail,
        role,
        expiresAt: expiresAt.toISOString(),
      }),
    },
  });

  return {
    invitation,
    token,
    delivery: {
      queued: true,
      reason: 'outbox_queued',
    },
  };
}

export async function rotateAccountInvitation(id: string, expiresAt?: Date) {
  const now = new Date();
  const nextExpiry = expiresAt ?? new Date(now.getTime() + DEFAULT_INVITATION_TTL_MS);
  if (nextExpiry.getTime() <= now.getTime()) {
    throw new AccountAdmissionError(
      400,
      'invalid_expiry',
      'Invitation expiry must be in the future.'
    );
  }

  const existing = await prisma.accountInvitation.findUnique({ where: { id } });
  if (!existing) {
    throw new AccountAdmissionError(404, 'not_found', 'Invitation not found.');
  }
  if (existing.status !== 'PENDING' || existing.expiresAt <= now) {
    throw new AccountAdmissionError(
      409,
      'invalid_transition',
      'Only a pending invitation can be rotated.'
    );
  }

  const token = createOpaqueToken();
  const tokenHash = hashOpaqueToken(token);

  const invitation = await prisma.accountInvitation.update({
    where: { id },
    data: {
      tokenHash,
      expiresAt: nextExpiry,
      emails: {
        create: {
          status: 'pending',
          expiresAt: nextExpiry,
          payload: JSON.stringify({
            type: 'account_invitation_rotated',
            to: existing.normalizedEmail,
            role: existing.role,
            invitePath: accountAdmissionSecretLink('/invite', token),
          }),
        },
      },
    },
    include: {
      invitedBy: { select: { id: true, name: true, email: true } },
      acceptedBy: { select: { id: true, name: true, email: true } },
    },
  });

  await prisma.auditLog.create({
    data: {
      action: 'admin.account_invitation.rotate',
      actorId: existing.invitedById,
      targetType: 'account_invitation',
      targetId: invitation.id,
      organizationId: invitation.organizationId,
      metadataJson: JSON.stringify({
        expiresAt: nextExpiry.toISOString(),
      }),
    },
  });

  return {
    invitation,
    token,
    delivery: {
      queued: true,
      reason: 'outbox_queued',
    },
  };
}

export async function revokeAccountInvitation(id: string) {
  const now = new Date();
  const existing = await prisma.accountInvitation.findUnique({ where: { id } });
  if (!existing) {
    throw new AccountAdmissionError(404, 'not_found', 'Invitation not found.');
  }
  if (existing.status === 'REVOKED') {
    return existing;
  }
  if (existing.status !== 'PENDING') {
    throw new AccountAdmissionError(
      409,
      'invalid_transition',
      'Only a pending invitation can be revoked.'
    );
  }

  const invitation = await prisma.accountInvitation.update({
    where: { id },
    data: {
      status: 'REVOKED',
      revokedAt: now,
      activeForEmail: null,
      tokenHash: null,
    },
    include: {
      invitedBy: { select: { id: true, name: true, email: true } },
      acceptedBy: { select: { id: true, name: true, email: true } },
    },
  });

  await prisma.auditLog.create({
    data: {
      action: 'admin.account_invitation.revoke',
      actorId: existing.invitedById,
      targetType: 'account_invitation',
      targetId: invitation.id,
      organizationId: invitation.organizationId,
      metadataJson: JSON.stringify({ status: 'REVOKED' }),
    },
  });

  return invitation;
}

export async function listAccountInvitations(organizationId: string) {
  await expirePendingInvitations();
  return prisma.accountInvitation.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
    include: {
      invitedBy: { select: { id: true, name: true, email: true } },
      acceptedBy: { select: { id: true, name: true, email: true } },
    },
  });
}
