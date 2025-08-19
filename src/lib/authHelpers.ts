// lib/authHelpers.ts
import { auth } from '@/auth';
import { cookies } from 'next/headers';

export const getUserIdFromSession = async () => {
  const session = await auth();

  if (!session || !session.user?.id) {
    // Clear NextAuth session cookie
    (await cookies()).set('next-auth.session-token', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    const error = new Error('Unauthorized — invalid or expired session');
    error.name = 'SessionError';
    throw error;
  }

  return session.user.id;
};
