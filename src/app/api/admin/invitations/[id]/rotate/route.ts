import { NextResponse } from 'next/server';
import {
  accountAdmissionSecretLink,
  rotateAccountInvitation,
} from '@/lib/account-admission';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    let expiresAt: Date | undefined;
    try {
      const body = await request.json();
      if (body?.expiresAt) {
        expiresAt = new Date(body.expiresAt);
      }
    } catch {
      // empty body is allowed
    }
    const grant = await rotateAccountInvitation(id, expiresAt);
    const acceptUrl = accountAdmissionSecretLink('/invite', grant.token, request.url);
    return NextResponse.json({
      ok: true,
      invitation: grant.invitation,
      token: grant.token,
      acceptUrl,
      delivery: grant.delivery,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err?.message || 'Failed to rotate invitation',
        code: err?.code || 'rotate_error',
      },
      { status: err?.status || 500 }
    );
  }
}
