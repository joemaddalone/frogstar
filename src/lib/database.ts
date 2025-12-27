import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@/db/schema';

const DB_FILE_NAME = process.env.DB_FILE_NAME;
const DB_FILE_NAME_TEST = process.env.DB_FILE_NAME_TEST;

// are we in test mode?
const isTest = process.env.NODE_ENV === 'test';

const client = createClient({
	url: isTest ? DB_FILE_NAME_TEST! : DB_FILE_NAME!,
});

client.execute('PRAGMA journal_mode = WAL;');
client.execute('PRAGMA busy_timeout = 5000;');

export const db = drizzle(client, { schema });