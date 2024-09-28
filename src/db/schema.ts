import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { CATEGORIES } from '@/lib/constants';

export const linkCategory = pgEnum('link_category', CATEGORIES);

export const links = pgTable(
  'links',
  {
    id: varchar('id', { length: 12 }).primaryKey(),

    key: varchar('key', { length: 255 }).unique().notNull(),
    url: text('url').notNull(),
    category: linkCategory('category'),
    version: integer('version').default(0).notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    urlIdx: index('links_url_idx').on(table.url),
    categoryIdx: index('links_category_idx').on(table.category),
  }),
);
