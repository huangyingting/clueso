import { prisma } from '@/lib/prisma';
import { accountAdmissionMode, verifiedProviderEmail } from './policy';

/**
 * Unified NextAuth `callbacks.signIn` admission gate for OAuth providers (`google`, `azure-ad`, etc.).
 *
 * Implements the ReadWise + HelloInterview unified contract:
 * 1. Existing linked `Account(provider, providerAccountId)` -> allow if user is active.
 * 2. Verified provider email matching an existing active `User` -> link `Account` and allow.
 * 3. Verified provider email matching a `PENDING` non-expired `AccountInvitation` -> atomically
 *    create `User`, link `Account`, claim `AccountInvitation` (`ACCEPTED`), and allow.
 * 4. Otherwise in `"invitation-only"` mode -> reject with `/login?error=InvitationRequired`.
 */
export async function authorizeSocialSignIn(params: {
  provider: string;
  providerAccountId: string;
  type?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  tokenType?: string;
  scope?: string;
  idToken?: string;
  sessionState?: string;
  profile?: Record<string, unknown>;
  userName?: string | null;
  userImage?: string | null;
}): Promise<true | string> {
  const now = new Date();

  const existingAccount = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: params.provider,
        providerAccountId: params.providerAccountId,
      },
    },
    include: { user: true },
  });

  if (existingAccount) {
    return existingAccount.user.status === 'active'
      ? true
      : '/login?error=AccountDisabled';
  }

  const verifiedEmail = verifiedProviderEmail(params.provider, params.profile);
  if (!verifiedEmail) {
    return '/login?error=OAuthEmailUnverified';
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: verifiedEmail },
  });

  if (existingUser) {
    if (existingUser.status !== 'active') {
      return '/login?error=AccountDisabled';
    }
    await prisma.account.create({
      data: {
        userId: existingUser.id,
        type: params.type || 'oauth',
        provider: params.provider,
        providerAccountId: params.providerAccountId,
        access_token: params.accessToken,
        refresh_token: params.refreshToken,
        expires_at: params.expiresAt,
        token_type: params.tokenType,
        scope: params.scope,
        id_token: params.idToken,
        session_state: params.sessionState,
      },
    });
    return true;
  }

  // Check if there is an active PENDING invitation for this verified email
  const invitation = await prisma.accountInvitation.findUnique({
    where: { activeForEmail: verifiedEmail },
  });

  if (invitation && invitation.status === 'PENDING' && invitation.expiresAt > now) {
    const displayName =
      params.userName?.trim() ||
      (typeof params.profile?.name === 'string' && params.profile.name.trim()) ||
      verifiedEmail.split('@')[0];
    const parts = displayName.split(' ');

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: verifiedEmail,
          name: displayName,
          firstName: parts[0] || displayName,
          lastName: parts.slice(1).join(' ') || '',
          pictureUrl: params.userImage || null,
          role: invitation.role || 'Editor',
          status: 'active',
          emailVerified: now,
          organizationId: invitation.organizationId,
        },
      });

      await tx.account.create({
        data: {
          userId: user.id,
          type: params.type || 'oauth',
          provider: params.provider,
          providerAccountId: params.providerAccountId,
          access_token: params.accessToken,
          refresh_token: params.refreshToken,
          expires_at: params.expiresAt,
          token_type: params.tokenType,
          scope: params.scope,
          id_token: params.idToken,
          session_state: params.sessionState,
        },
      });

      await tx.accountInvitation.updateMany({
        where: { id: invitation.id, status: 'PENDING' },
        data: {
          status: 'ACCEPTED',
          acceptedById: user.id,
          acceptedAt: now,
          activeForEmail: null,
          tokenHash: null,
        },
      });

      await tx.auditLog.create({
        data: {
          action: 'account.invitation.accept.oauth',
          actorId: user.id,
          actorEmail: user.email,
          actorRole: user.role,
          targetType: 'account_invitation',
          targetId: invitation.id,
          organizationId: invitation.organizationId,
          metadataJson: JSON.stringify({
            provider: params.provider,
            status: 'ACCEPTED',
            role: user.role,
          }),
        },
      });
    });

    return true;
  }

  if (accountAdmissionMode() === 'invitation-only') {
    return '/login?error=InvitationRequired';
  }

  return true;
}
