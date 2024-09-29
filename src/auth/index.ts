import { Lucia } from 'lucia';

import { adapter } from '../db';
import { UserSelect } from '../db/schema';

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes(databaseUserAttributes) {
    return {
      username: databaseUserAttributes.username,
    };
  },
});

// IMPORTANT!
declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: UserSelect;
  }
}
