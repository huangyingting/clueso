import { prisma } from '@/lib/prisma';
import { AccountAdmissionError } from './errors';
import { hashPassword } from './passwords';
import { accountAdmissionMode, isValidAccountEmail, normalizeAccountEmail } from './policy';

export type BootstrapStatusView = {
  needsBootstrap: boolean;
  adminCount: number;
  admins: Array<{
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
  }>;
  admissionMode: 'invitation-only' | 'public';
  envBootstrapConfigured: boolean;
  requiresSetupToken: boolean;
};

/**
 * If `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD` are set in the environment,
 * ensures that the bootstrap administrator account and its `PasswordCredential` exist.
 */
export async function ensureEnvBootstrapAdmin(): Promise<void> {
  const rawEmail = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim();
  const rawPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  if (!rawEmail || !rawPassword || rawPassword.length < 8) {
    return;
  }

  const email = normalizeAccountEmail(rawEmail);
  if (!isValidAccountEmail(email)) {
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    include: { passwordCredential: { select: { id: true } } },
  });

  if (existing && existing.role === 'Admin' && existing.status === 'active' && existing.passwordCredential) {
    return;
  }

  await bootstrapAdmin({
    email,
    password: rawPassword,
    name: process.env.BOOTSTRAP_ADMIN_NAME?.trim() || 'Bootstrap Admin',
    allowExistingAdmin: true,
  });
}

export async function getBootstrapStatus(): Promise<BootstrapStatusView> {
  await ensureEnvBootstrapAdmin();

  const admins = await prisma.user.findMany({
    where: {
      role: 'Admin',
      status: 'active',
    },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  const adminCount = admins.length;
  const configuredToken = Boolean(process.env.BOOTSTRAP_ADMIN_TOKEN?.trim());

  return {
    needsBootstrap: adminCount === 0,
    adminCount,
    admins: admins.map((a) => ({
      id: a.id,
      email: a.email,
      name: a.name,
      role: a.role,
      createdAt: a.createdAt.toISOString(),
    })),
    admissionMode: accountAdmissionMode(),
    envBootstrapConfigured: Boolean(
      process.env.BOOTSTRAP_ADMIN_EMAIL?.trim() && process.env.BOOTSTRAP_ADMIN_PASSWORD
    ),
    requiresSetupToken: adminCount > 0 || configuredToken,
  };
}

/**
 * Creates or promotes the bootstrap administrator account so an operator can sign in
 * and issue invitations via `/admin/invitations`.
 *
 * Mirrors ReadWise `bootstrapAdmin()` + HelloInterview `bootstrapAdminAccount()`:
 * - When `adminCount === 0` (fresh deployment), allows creating the first Admin.
 * - When `adminCount > 0`, requires either `allowExistingAdmin: true` (CLI/Admin session)
 *   or a valid `setupToken` matching `BOOTSTRAP_ADMIN_TOKEN` (defaults to `"clueso-bootstrap-admin-2026"` in dev).
 */
export async function bootstrapAdmin(input: {
  email: string;
  password: string;
  name?: string | null;
  organizationName?: string | null;
  setupToken?: string | null;
  allowExistingAdmin?: boolean;
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
  const expectedToken =
    process.env.BOOTSTRAP_ADMIN_TOKEN?.trim() || 'clueso-bootstrap-admin-2026';

  return prisma.$transaction(async (tx) => {
    const adminCount = await tx.user.count({
      where: { role: 'Admin', status: 'active' },
    });

    if (adminCount > 0 && !input.allowExistingAdmin) {
      const provided = input.setupToken?.trim() || '';
      if (!provided || provided !== expectedToken) {
        throw new AccountAdmissionError(
          409,
          'admin_exists',
          'An administrator already exists. Sign in as an existing Admin or provide the Bootstrap Setup Token.'
        );
      }
    }

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
    } else if (input.organizationName?.trim()) {
      org = await tx.organization.update({
        where: { id: org.id },
        data: { name: input.organizationName.trim() },
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
          bootstrapped: true,
          promotedExisting: Boolean(existing),
          previousAdminCount: adminCount,
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
