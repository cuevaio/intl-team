'use server';

import { cookies } from 'next/headers';

import { lucia } from '@/auth';
import { verify } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';

import { db, schema } from '@/db';

export async function signin(formData: FormData): Promise<
  | {
      success: true;
    }
  | { success: false; error: string }
> {
  const username = formData.get('username');
  if (
    typeof username !== 'string' ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      success: false,
      error: 'Invalid username',
    };
  }
  const password = formData.get('password');
  if (
    typeof password !== 'string' ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      success: false,
      error: 'Invalid password',
    };
  }

  const [existingUser] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.username, username.toLowerCase()));

  if (!existingUser) {
    // NOTE:
    // Returning immediately allows malicious actors to figure out valid usernames from response times,
    // allowing them to only focus on guessing passwords in brute-force attacks.
    // As a preventive measure, you may want to hash passwords even for invalid usernames.
    // However, valid usernames can be already be revealed with the signup page among other methods.
    // It will also be much more resource intensive.
    // Since protecting against this is non-trivial,
    // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
    // If usernames are public, you may outright tell the user that the username is invalid.
    return {
      success: false,
      error: 'Incorrect username or password',
    };
  }

  const validPassword = await verify(existingUser.passwordHash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  if (!validPassword) {
    return {
      success: false,
      error: 'Incorrect username or password',
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return {
    success: true,
  };
}
