import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { prisma } from './prisma';

export async function getActiveUserAndOrg() {
  let email = 'alex@acme.io';
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      email = session.user.email;
    }
  } catch {
    // Fallback to default seeded admin user
  }

  let user = await prisma.user.findUnique({
    where: { email },
    include: { organization: true },
  });

  if (!user) {
    user = await prisma.user.findFirst({
      include: { organization: true },
    });
  }

  return user;
}
