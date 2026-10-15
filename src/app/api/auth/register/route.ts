import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import {
  accountAdmissionMode,
  AccountAdmissionError,
  registerWithInvitation,
} from '@/lib/account-admission';

export async function GET() {
  return NextResponse.json({
    admissionMode: accountAdmissionMode(),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email || '').trim().toLowerCase();
    const name = (body.name || email.split('@')[0] || 'New User').trim();
    const password = String(body.password || '');
    const token = String(body.token || '').trim();
    const workspaceName = (body.workspaceName || 'Acme Product Studio').trim();
    const mode = accountAdmissionMode();

    if (mode === 'invitation-only') {
      if (!token) {
        return NextResponse.json(
          {
            error: 'Clueso is currently invitation-only. A valid personal invitation link is required to create an account.',
            code: 'invitation_required',
          },
          { status: 403 }
        );
      }

      const result = await registerWithInvitation({
        token,
        email,
        password,
        name,
      });

      return NextResponse.json(
        {
          ok: true,
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
          },
        },
        { status: 201 }
      );
    }

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ user: existing, message: 'Account already exists' });
    }

    let org = await prisma.organization.findFirst({
      where: { id: 'org_clueso_acme' },
    });

    if (!org) {
      org = await prisma.organization.create({
        data: {
          id: 'org_clueso_acme',
          name: workspaceName,
          domain: email.split('@')[1] || 'acme.io',
        },
      });
    }

    const passwordHash = await bcrypt.hash(password || 'clueso123', 10);
    const parts = name.split(' ');
    const user = await prisma.user.create({
      data: {
        email,
        name,
        firstName: parts[0] || name,
        lastName: parts.slice(1).join(' ') || '',
        passwordHash,
        role: 'Admin',
        organizationId: org.id,
      },
    });

    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (error: any) {
    if (error instanceof AccountAdmissionError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { error: error?.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
