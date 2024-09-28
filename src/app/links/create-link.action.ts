'use server';

import { revalidatePath } from 'next/cache';

import { DrizzleError } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { links } from '@/db/schema';

import { nanoid } from '@/lib/nanoid';

export async function createLink(formData: FormData): Promise<
  | {
      success: true;
    }
  | { success: false; error: string }
> {
  const url = formData.get('url');
  const key = formData.get('key');

  const urlParsing = z.string().url().safeParse(url);
  if (!urlParsing.success) {
    return {
      success: false,
      error: 'Url: ' + urlParsing.error.issues[0].message,
    };
  }

  const keyParsing = z
    .string({ description: 'key' })
    .min(1)
    .max(255)
    .safeParse(key);
  if (!keyParsing.success) {
    return {
      success: false,
      error: 'Title: ' + keyParsing.error.issues[0].message,
    };
  }

  try {
    await db.insert(links).values({
      id: nanoid(),
      url: urlParsing.data,
      key: keyParsing.data,
    });

    revalidatePath(`/links`, 'page');
    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof DrizzleError) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  return {
    success: false,
    error: 'Internal server error',
  };
}
