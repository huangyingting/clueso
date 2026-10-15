import { NextResponse } from 'next/server';
import { getActiveWorkspaceContext } from '@/lib/workspace';
import {
  accountAdmissionMode,
  accountAdmissionSecretLink,
  createAccountInvitation,
  listAccountInvitations,
} from '@/lib/account-admission';

export async function GET() {
  const { user, org } = await getActiveWorkspaceContext();
  if (!org || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const invitations = await listAccountInvitations(org.id);
  return NextResponse.json({
    admissionMode: accountAdmissionMode(),
    invitations,
  });
}

export async function POST(request: Request) {
  try {
    const { user, org } = await getActiveWorkspaceContext();
    if (!org || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const email = String(body.email || '').trim();
    const role = String(body.role || 'Editor').trim();
    const expiresAt = body.expiresAt ? new Date(body.expiresAt) : undefined;

    const grant = await createAccountInvitation({
      email,
      role,
      invitedById: user.id,
      organizationId: org.id,
      expiresAt,
    });

    const acceptUrl = accountAdmissionSecretLink('/invite', grant.token, request.url);

    return NextResponse.json(
      {
        ok: true,
        invitation: grant.invitation,
        token: grant.token,
        acceptUrl,
        delivery: grant.delivery,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err?.message || 'Failed to create invitation',
        code: err?.code || 'invitation_error',
      },
      { status: err?.status || 500 }
    );
  }
}
