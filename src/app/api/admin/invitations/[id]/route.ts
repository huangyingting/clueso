import { NextResponse } from 'next/server';
import { revokeAccountInvitation } from '@/lib/account-admission';

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const invitation = await revokeAccountInvitation(id);
    return NextResponse.json({
      ok: true,
      invitation,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err?.message || 'Failed to revoke invitation',
        code: err?.code || 'revoke_error',
      },
      { status: err?.status || 500 }
    );
  }
}
