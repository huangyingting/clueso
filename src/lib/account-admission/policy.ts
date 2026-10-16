export const ACCOUNT_ADMISSION_MODES = ['invitation-only', 'public'] as const;
export type AccountAdmissionMode = (typeof ACCOUNT_ADMISSION_MODES)[number];

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
 * Defaults to `"invitation-only"` (fail-closed) unless `ACCOUNT_ADMISSION_MODE="public"`
 * is explicitly configured.
 */
export function accountAdmissionMode(): AccountAdmissionMode {
  const configured = process.env.ACCOUNT_ADMISSION_MODE?.trim().toLowerCase();
  return configured === 'public' || configured === 'invitation-only'
    ? configured
    : 'invitation-only';
}

export function verifiedProviderEmail(
  provider: string,
  profile: Record<string, unknown> | undefined
): string | null {
  if (!profile) return null;

  if (provider === 'google') {
    const email = typeof profile.email === 'string' ? profile.email : '';
    const verified = profile.email_verified === true;
    return verified && isValidAccountEmail(email) ? normalizeAccountEmail(email) : null;
  }

  if (provider === 'azure-ad' || provider === 'microsoft-entra-id') {
    const tenant = process.env.AZURE_AD_TENANT_ID?.trim().toLowerCase();
    if (!tenant || tenant === 'common' || tenant === 'organizations' || tenant === 'consumers') {
      return null;
    }
    const candidate =
      (typeof profile.email === 'string' && profile.email) ||
      (typeof profile.preferred_username === 'string' && profile.preferred_username) ||
      '';
    return isValidAccountEmail(candidate) ? normalizeAccountEmail(candidate) : null;
  }

  return null;
}
