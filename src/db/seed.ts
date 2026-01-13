import { db } from "@/lib/client/database/database";
import { commonBarbells, commonExercises, commonPlates } from "./common-data";
import {
	barbells,
	exercises,
	plates,
	plannedSets,
	sessions,
	actualSets,
} from "./schema";

import type {
	InsertablePlannedSet,
	InsertableSession,
	InsertableActualSet,
} from "./schema";

const isTest =
	process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development";

export async function main() {
	// insert if table is empty
	if ((await db.select().from(barbells).limit(1).get()) === undefined) {
		await db.insert(barbells).values(commonBarbells);
	}
	if ((await db.select().from(plates).limit(1).get()) === undefined) {
		await db.insert(plates).values(commonPlates);
	}
	if ((await db.select().from(exercises).limit(1).get()) === undefined) {
		try {
			await db.insert(exercises).values(commonExercises);
		} catch (error) {
			console.error("Failed to insert exercises", error);
		}
	}

	if (isTest) {
		// insert a session
		await db.insert(sessions).values({
			date: new Date(),
		} as InsertableSession);
		// insert a plannedSet
		await db.insert(plannedSets).values({
			sessionId: 1,
			exerciseId: 1,
			intendedReps: 1,
			intendedSets: 1,
			targetWeight: 1,
		} as InsertablePlannedSet);

		// insert an actualSet
		await db.insert(actualSets).values({
			plannedSetId: 1,
			actualReps: 1,
			actualWeight: 1,
		} as InsertableActualSet);
	}
}

// Only run if this file is executed directly
if (process.argv[1]?.endsWith("seed.ts")) {
	main().catch(console.error);
}
