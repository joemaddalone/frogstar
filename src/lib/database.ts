import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../db/schema';

const DB_FILE_NAME = process.env.DB_FILE_NAME;
const DB_FILE_NAME_TEST = process.env.DB_FILE_NAME_TEST;

// are we in test mode?
const isTest = process.env.NODE_ENV === 'test';

export const db = drizzle(isTest ? DB_FILE_NAME_TEST! : DB_FILE_NAME!, { schema });