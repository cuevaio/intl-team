/* eslint-disable @typescript-eslint/no-explicit-any */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('Missing DB_URL');
}

// Singleton function to ensure only one db instance is created
function singleton<Value>(name: string, value: () => Value): Value {
  const globalAny: any = global;
  globalAny.__singletons = globalAny.__singletons || {};

  if (!globalAny.__singletons[name]) {
    globalAny.__singletons[name] = value();
  }

  return globalAny.__singletons[name];
}

export const createDBConnection = () => {
  const client = neon(process.env.DATABASE_URL!);

  const db = drizzle(client, { schema });

  return db;
};
const db = singleton('db', createDBConnection);

export { db, schema };
