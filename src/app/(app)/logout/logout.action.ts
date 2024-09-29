'use server';

import { cookies } from 'next/headers';

import { lucia } from '@/auth';
import { validateRequest } from '@/auth/validate-request';

export async function logout(): Promise<
  | {
      success: true;
    }
  | { success: false; error: string }
> {
  const { session } = await validateRequest();
  if (!session) {
    return {
      success: false,
      error: 'Unauthorized',
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return {
    success: true,
  };
}
