import { createHash, randomBytes } from 'node:crypto';

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
