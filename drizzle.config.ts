import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema.ts',
  out: './db/migrations/generated',
  dialect: 'mysql',
  dbCredentials: { url: process.env.DATABASE_URL ?? '' },
});
