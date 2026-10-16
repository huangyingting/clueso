import { prisma } from '@/lib/prisma';
import { AccountAdmissionError } from './errors';
import { hashPassword } from './passwords';
import { isValidAccountEmail, normalizeAccountEmail } from './policy';
import { hashOpaqueToken } from './tokens';

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

  const passwordHash = await hashPassword(input.password);
  const displayName = input.name?.trim() || normalizedEmail.split('@')[0];
  const parts = displayName.split(' ');

  return prisma.$transaction(async (tx) => {
    const existingUser = await tx.user.findUnique({
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

    const user = existingUser
      ? await tx.user.update({
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
      : await tx.user.create({
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

    await tx.passwordCredential.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        passwordHash,
        passwordChangedAt: now,
      },
      update: {
        passwordHash,
        passwordChangedAt: now,
        resetTokenHash: null,
        resetExpiresAt: null,
      },
    });

    const claimed = await tx.accountInvitation.updateMany({
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

    await tx.auditLog.create({
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
  });
}
