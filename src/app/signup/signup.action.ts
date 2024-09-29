'use server';

import { cookies } from 'next/headers';

import { lucia } from '@/auth';
import { hash } from '@node-rs/argon2';
import { DrizzleError } from 'drizzle-orm';

import { db, schema } from '@/db';

import { nanoid } from '@/lib/nanoid';

export async function signup(formData: FormData): Promise<
  | {
      success: true;
    }
  | { success: false; error: string }
> {
  const username = formData.get('username');
  // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
  // keep in mind some database (e.g. mysql) are case insensitive
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

  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const userId = nanoid(12);
  // TODO: check if username is already used
  try {
    await db.insert(schema.users).values({
      id: userId,
      username: username,
      passwordHash: passwordHash,
    });
  } catch (error) {
    if (error instanceof DrizzleError) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  const session = await lucia.createSession(userId, {});
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
