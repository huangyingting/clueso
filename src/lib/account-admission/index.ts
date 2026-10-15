import { createHash, randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const ACCOUNT_ADMISSION_MODES = ['invitation-only', 'public'] as const;
export type AccountAdmissionMode = (typeof ACCOUNT_ADMISSION_MODES)[number];

const DEFAULT_INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export class AccountAdmissionError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function normalizeAccountEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidAccountEmail(email: string): boolean {
  const normalized = normalizeAccountEmail(email);
  const separator = normalized.indexOf('@');
  return (
    normalized.length <= 320 &&
    separator > 0 &&
    separator === normalized.lastIndexOf('@') &&
    separator < normalized.length - 1 &&
    !/\s/.test(normalized)
  );
}

/**
 * Mirrors ReadWise `accountAdmissionMode()`: defaults to `"invitation-only"` (fail-closed)
 * unless `ACCOUNT_ADMISSION_MODE="public"` is explicitly configured.
 */
export function accountAdmissionMode(): AccountAdmissionMode {
  const configured = process.env.ACCOUNT_ADMISSION_MODE?.trim().toLowerCase();
  return configured === 'public' || configured === 'invitation-only'
    ? configured
    : 'invitation-only';
}

export function createOpaqueToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashOpaqueToken(token: string): string {
  return createHash('sha256').update(token.trim(), 'utf8').digest('base64url');
}

export function maskEmail(email: string): string {
  const [local = '', domain = ''] = email.split('@');
  if (!domain) return '***';
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}${'*'.repeat(Math.max(1, local.length - visible.length))}@${domain}`;
}

export function accountAdmissionSecretLink(
  pathPrefix: string,
  token: string,
  requestUrl?: string
): string {
  const candidates = [
    requestUrl,
    process.env.APP_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXTAUTH_URL,
  ];
  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      const u = new URL(candidate);
      if (u.protocol === 'http:' || u.protocol === 'https:') {
        return new URL(`${pathPrefix}/${encodeURIComponent(token)}`, u.origin).toString();
      }
    } catch {
      // ignore invalid URL
    }
  }
  return `${pathPrefix}/${encodeURIComponent(token)}`;
}

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

export type PublicInvitationView = {
  id: string;
  status: 'pending' | 'accepted' | 'revoked' | 'expired' | 'invalid';
  email: string | null;
  maskedEmail: string | null;
  role: string | null;
  organizationName: string | null;
  expiresAt: string | null;
};

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
    select: { id: true, status: true, passwordHash: true },
  });
  if (existingUser && existingUser.status === 'active' && existingUser.passwordHash) {
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
      queued: false,
      reason: 'copy_one_time_link',
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
      queued: false,
      reason: 'copy_one_time_link',
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

export async function registerWithInvitation(input: {
  token: string;
  email: string;
  password: string;
  name?: string;
}) {
  if (!isValidAccountEmail(input.email)) {
    throw new AccountAdmissionError(400, 'invalid_email', 'Enter a valid email address.');
  }
  if (!input.password || input.password.length < 8 || input.password.length > 128) {
    throw new AccountAdmissionError(
      400,
      'invalid_password',
      'Password must be between 8 and 128 characters.'
    );
  }

  const normalizedEmail = normalizeAccountEmail(input.email);
  const tokenHash = hashOpaqueToken(input.token);
  const now = new Date();

  const invitation = await prisma.accountInvitation.findUnique({
    where: { tokenHash },
  });

  if (!invitation || invitation.status !== 'PENDING') {
    throw new AccountAdmissionError(
      410,
      'invalid_invitation',
      'This invitation is invalid or no longer active.'
    );
  }

  if (invitation.expiresAt <= now) {
    await prisma.accountInvitation.update({
      where: { id: invitation.id },
      data: {
        status: 'EXPIRED',
        activeForEmail: null,
        tokenHash: null,
      },
    });
    throw new AccountAdmissionError(410, 'expired', 'This invitation has expired.');
  }

  if (invitation.normalizedEmail !== normalizedEmail) {
    throw new AccountAdmissionError(
      403,
      'email_mismatch',
      'The invitation does not match this email address.'
    );
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const displayName = input.name?.trim() || normalizedEmail.split('@')[0];
  const parts = displayName.split(' ');

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser && existingUser.status === 'active' && existingUser.passwordHash) {
    throw new AccountAdmissionError(
      409,
      'already_member',
      'A Clueso account already exists for this email.'
    );
  }

  const user = existingUser
    ? await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name: displayName,
          firstName: parts[0] || displayName,
          lastName: parts.slice(1).join(' ') || '',
          passwordHash,
          role: invitation.role || 'Editor',
          status: 'active',
          emailVerified: now,
        },
      })
    : await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: displayName,
          firstName: parts[0] || displayName,
          lastName: parts.slice(1).join(' ') || '',
          passwordHash,
          role: invitation.role || 'Editor',
          status: 'active',
          emailVerified: now,
          organizationId: invitation.organizationId,
        },
      });

  const claimed = await prisma.accountInvitation.updateMany({
    where: {
      id: invitation.id,
      tokenHash,
      status: 'PENDING',
    },
    data: {
      status: 'ACCEPTED',
      acceptedById: user.id,
      acceptedAt: now,
      activeForEmail: null,
      tokenHash: null,
    },
  });

  if (claimed.count !== 1) {
    throw new AccountAdmissionError(
      409,
      'claim_conflict',
      'This invitation has already been claimed.'
    );
  }

  await prisma.auditLog.create({
    data: {
      action: 'account.invitation.accept',
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      targetType: 'account_invitation',
      targetId: invitation.id,
      organizationId: invitation.organizationId,
      metadataJson: JSON.stringify({ status: 'ACCEPTED', role: user.role }),
    },
  });

  return { user, invitation };
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
