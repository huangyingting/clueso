import { prisma } from '@/lib/prisma';
import { AccountAdmissionError } from './errors';
import { hashPassword } from './passwords';
import { isValidAccountEmail, normalizeAccountEmail } from './policy';

/**
 * Provisions or promotes a root Administrator account from the deployment host CLI
 * (`npm run bootstrap:admin -- --email <email> --password-stdin`).
 *
 * Security invariant: Never exposed via an HTTP API endpoint or public web route.
 * Only an operator with shell/deployment access to the host and database can execute this.
 */
export async function bootstrapAdmin(input: {
  email: string;
  password: string;
  name?: string | null;
  organizationName?: string | null;
}) {
  const email = normalizeAccountEmail(input.email);
  if (!isValidAccountEmail(input.email)) {
    throw new AccountAdmissionError(
      400,
      'invalid_email',
      'Enter a valid administrator email address.'
    );
  }

  if (!input.password || input.password.length < 8 || input.password.length > 128) {
    throw new AccountAdmissionError(
      400,
      'invalid_password',
      'Administrator password must be between 8 and 128 characters.'
    );
  }

  const passwordHash = await hashPassword(input.password);
  const now = new Date();
  const displayName = input.name?.trim() || email.split('@')[0] || 'Workspace Admin';
  const parts = displayName.split(' ');

  return prisma.$transaction(async (tx) => {
    let org = await tx.organization.findFirst({
      orderBy: { createdAt: 'asc' },
    });

    if (!org) {
      const domain = email.split('@')[1] || 'acme.io';
      org = await tx.organization.create({
        data: {
          id: 'org_clueso_acme',
          name: input.organizationName?.trim() || 'Acme Product Studio',
          domain,
          plan: 'Enterprise',
          region: 'usw1',
          openDoor: false,
          aiCreditsRemaining: 50000,
          aiCreditsTotal: 50000,
          seatsPurchased: 25,
          mcpConnected: true,
        },
      });
    }

    const existing = await tx.user.findUnique({
      where: { email },
    });

    const user = existing
      ? await tx.user.update({
          where: { id: existing.id },
          data: {
            name: displayName,
            firstName: parts[0] || displayName,
            lastName: parts.slice(1).join(' ') || '',
            passwordHash,
            role: 'Admin',
            status: 'active',
            emailVerified: existing.emailVerified ?? now,
          },
        })
      : await tx.user.create({
          data: {
            email,
            name: displayName,
            firstName: parts[0] || displayName,
            lastName: parts.slice(1).join(' ') || '',
            passwordHash,
            role: 'Admin',
            status: 'active',
            emailVerified: now,
            organizationId: org.id,
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

    await tx.auditLog.create({
      data: {
        action: 'system.admin.bootstrap',
        actorId: user.id,
        actorEmail: user.email,
        actorRole: 'Admin',
        targetType: 'user',
        targetId: user.id,
        organizationId: user.organizationId,
        metadataJson: JSON.stringify({
          source: 'cli',
          bootstrapped: true,
          promotedExisting: Boolean(existing),
        }),
      },
    });

    return {
      user,
      organization: org,
      created: !existing,
    };
  });
}
