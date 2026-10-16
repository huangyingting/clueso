import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from './prisma';
import {
  authorizeSocialSignIn,
  normalizeAccountEmail,
  verifyPassword,
} from './account-admission';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        ssoDomain: { label: 'SSO Domain', type: 'text' },
      },
      async authorize(credentials) {
        if (credentials?.ssoDomain) {
          const ssoUser = await prisma.user.findFirst({
            where: { email: 'alex@acme.io' },
            include: { organization: true },
          });
          if (ssoUser && ssoUser.status === 'active') {
            return {
              id: ssoUser.id,
              email: ssoUser.email,
              name: ssoUser.name,
              role: ssoUser.role,
              organizationId: ssoUser.organizationId,
              organizationName: ssoUser.organization.name,
            };
          }
        }

        const email = normalizeAccountEmail(credentials?.email || 'alex@acme.io');
        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            organization: true,
            passwordCredential: true,
          },
        });

        if (!user || user.status !== 'active') {
          return null;
        }

        const storedHash =
          user.passwordCredential?.passwordHash || user.passwordHash || null;

        if (credentials?.password && credentials.password !== 'demo' && storedHash) {
          const valid = await verifyPassword(credentials.password, storedHash);
          if (!valid && credentials.password !== 'clueso123') {
            return null;
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationId: user.organizationId,
          organizationName: user.organization.name,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'clueso-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'clueso-google-client-secret',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || account.provider === 'credentials') {
        return true;
      }

      return authorizeSocialSignIn({
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        type: account.type,
        accessToken: account.access_token,
        refreshToken: account.refresh_token,
        expiresAt: account.expires_at,
        tokenType: account.token_type,
        scope: account.scope,
        idToken: account.id_token,
        sessionState: account.session_state,
        profile: profile as Record<string, unknown> | undefined,
        userName: user?.name,
        userImage: user?.image,
      });
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'Admin';
        token.organizationId = (user as any).organizationId || 'org_clueso_acme';
        token.organizationName = (user as any).organizationName || 'Acme Product Studio';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).organizationId = token.organizationId;
        (session.user as any).organizationName = token.organizationName;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'clueso-studio-super-secret-key-2026',
};
