import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email || '').trim().toLowerCase();
    const name = (body.name || email.split('@')[0] || 'New User').trim();
    const password = body.password || 'clueso123';
    const workspaceName = (body.workspaceName || 'Acme Product Studio').trim();

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

    const passwordHash = await bcrypt.hash(password, 10);
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

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Registration failed' }, { status: 500 });
  }
}
