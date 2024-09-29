'use server';

import { revalidatePath } from 'next/cache';

import { validateRequest } from '@/auth/validate-request';
import { DrizzleError, eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { links } from '@/db/schema';

import { CATEGORIES } from '@/lib/constants';
import { generateEmbedding } from '@/lib/generate-embedding';
import { nanoid, randomLinkKey } from '@/lib/nanoid';

export async function createLink(formData: FormData): Promise<
  | {
      success: true;
      data: {
        isPublic: boolean;
      };
    }
  | { success: false; error: string }
> {
  let rawUrl = String(formData.get('url'));
  if (!rawUrl.startsWith('https://')) rawUrl = 'https://' + rawUrl;

  const urlParsing = z.string().url().safeParse(rawUrl);
  if (!urlParsing.success) {
    return {
      success: false,
      error: 'Url: ' + urlParsing.error.issues[0].message,
    };
  }

  const url = urlParsing.data;
  const urlEmbedding = await generateEmbedding(url);

  const categoryParsing = z
    .enum(CATEGORIES)
    .nullish()
    .safeParse(formData.get('category'));

  const validadedRequest = await validateRequest();
  const user = validadedRequest.user!;

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
        error: 'Key: ' + keyParsing.error.issues[0].message,
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

  const keyEmbedding = await generateEmbedding(key!);

  const isPublicParsing = z
    .enum(['on'])
    .nullish()
    .safeParse(formData.get('public'));
  if (!isPublicParsing.success) {
    return {
      success: false,
      error: 'Public: ' + isPublicParsing.error.issues[0].message,
    };
  }

  const isPublic = isPublicParsing.data === 'on' ? true : false;

  try {
    await db.insert(links).values({
      id: nanoid(),
      url,
      key: key!,
      category: categoryParsing.data,
      ownerId: user.id,
      isPublic,
      urlEmbedding,
      keyEmbedding,
    });

    revalidatePath('/(app)/links/personal/page');
    if (isPublic) {
      revalidatePath('/(app)/links/page');
    }

    return {
      success: true,
      data: {
        isPublic,
      },
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
