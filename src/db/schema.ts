import {
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const links = pgTable(
  'links',
  {
    id: varchar('id', { length: 12 }).primaryKey(),

    key: varchar('key', { length: 255 }).unique().notNull(),
    url: text('url').notNull(),

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
    idIdx: uniqueIndex('links_id_idx').on(table.id),
    keyIdx: uniqueIndex('links_key_idx').on(table.key),
    urlIdx: uniqueIndex('links_url_idx').on(table.key),
  }),
);
