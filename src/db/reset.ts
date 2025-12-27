import { db } from "@/lib/database";
import { sql } from 'drizzle-orm';
import { sessions, barbells, plates, exercises, plannedSets, actualSets } from "./schema";

export async function reset() {
	// clears all data from the database
	// We delete in order to respect foreign key constraints
	await db.delete(actualSets);
	await db.delete(plannedSets);
	await db.delete(exercises);
	await db.delete(sessions);
	await db.delete(barbells);
	await db.delete(plates);

	// Reset auto-increment counters for all tables
	await db.run(sql`DELETE FROM sqlite_sequence`);
}

// Only run if this file is executed directly
if (process.argv[1]?.endsWith('reset.ts')) {
	reset().catch(console.error);
}