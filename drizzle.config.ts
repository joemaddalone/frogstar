import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const DB_FILE_NAME = process.env.DB_FILE_NAME;
const DB_FILE_NAME_TEST = process.env.DB_FILE_NAME_TEST;

// are we in test mode?
const isTest = process.env.NODE_ENV === 'test';

export default defineConfig({
	out: './drizzle',
	schema: './src/db/schema.ts',
	dialect: 'sqlite',
	dbCredentials: {
		url: isTest ? DB_FILE_NAME_TEST! : DB_FILE_NAME!,
	},
});