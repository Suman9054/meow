import { db } from '@/db';
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from "better-auth/tanstack-start";
import * as schema from '@/db/auth-schema'
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: schema
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [tanstackStartCookies()]
});
