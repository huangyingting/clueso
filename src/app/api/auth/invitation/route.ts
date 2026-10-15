import { NextResponse } from 'next/server';
import {
  accountAdmissionMode,
  inspectAccountInvitation,
} from '@/lib/account-admission';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body.token || '').trim();
    if (!token) {
      return NextResponse.json(
        { error: 'Invitation token is required' },
        { status: 400 }
      );
    }
    const invitation = await inspectAccountInvitation(token);
    return NextResponse.json({
      invitation,
      admissionMode: accountAdmissionMode(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to inspect invitation' },
      { status: err?.status || 500 }
    );
  }
}
