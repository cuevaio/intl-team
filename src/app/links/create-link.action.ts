'use server';

import { revalidatePath } from 'next/cache';

import { DrizzleError, eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { links } from '@/db/schema';

import { CATEGORIES } from '@/lib/constants';
import { nanoid, randomLinkKey } from '@/lib/nanoid';

export async function createLink(formData: FormData): Promise<
  | {
      success: true;
    }
  | { success: false; error: string }
> {
  let url = String(formData.get('url'));
  if (!url.startsWith('https://')) url = 'https://' + url;

  const urlParsing = z.string().url().safeParse(url);
  if (!urlParsing.success) {
    return {
      success: false,
      error: 'Url: ' + urlParsing.error.issues[0].message,
    };
  }
  const categoryParsing = z
    .enum(CATEGORIES)
    .optional()
    .safeParse(formData.get('category'));

  if (!categoryParsing.success) {
    return {
      success: false,
      error: 'Category: ' + categoryParsing.error.issues[0].message,
    };
  }

  let key: string | undefined = undefined;

  if (formData.get('key')) {
    const keyParsing = z
      .string({ description: 'key' })
      .min(1)
      .max(255)
      .safeParse(formData.get('key'));

    if (!keyParsing.success) {
      return {
        success: false,
        error: 'Title: ' + keyParsing.error.issues[0].message,
      };
    } else {
      key = keyParsing.data;
    }
  }

  if (!key) {
    const randomKey = randomLinkKey();
    while (true) {
      const existingLink = await db
        .select()
        .from(links)
        .where(eq(links.key, randomKey));

      if (existingLink.length === 0) {
        key = randomKey;
        break;
      }
    }
  }

  try {
    await db.insert(links).values({
      id: nanoid(),
      url: urlParsing.data,
      key: key!,
      category: categoryParsing.data,
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
