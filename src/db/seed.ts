import { db } from "../lib/database";
import { barbells, exercises, plates, plannedSets, InsertablePlannedSet, sessions, InsertableSession, InsertableActualSet, actualSets } from "./schema";

const isTest = process.env.NODE_ENV === "test";

const commonExercises = [
	{
		name: "Bench Press",
		category: "Push",
		equipmentType: "barbell",
		barbellId: 1,
	},
	{
		name: "Barbell Curls",
		category: "Pull",
		equipmentType: "barbell",
		barbellId: 1,
	},
	{
		name: "Squat",
		category: "Legs",
		equipmentType: "barbell",
		barbellId: 1,
	},
	{
		name: "Deadlift",
		category: "Pull",
		equipmentType: "barbell",
		barbellId: 1,
	},
	{
		name: "Overhead Press",
		category: "Push",
		equipmentType: "barbell",
		barbellId: 1,
	},
	{
		name: "Barbell Row",
		category: "Pull",
		equipmentType: "barbell",
		barbellId: 1,
	},
	{ name: "Pull-ups", category: "Pull", equipmentType: "bodyweight", barbellId: 1 },
	{ name: "Dips", category: "Push", equipmentType: "bodyweight", barbellId: 1 },
	{ name: "Lunges", category: "Legs", equipmentType: "bodyweight", barbellId: 1 },
	{
		name: "Romanian Deadlift",
		category: "Pull",
		equipmentType: "barbell",
		barbellId: 1,
	},
	{ name: "Incline Bench Press", category: "Push", equipmentType: "barbell", barbellId: 1 },
	{ name: "Dumbbell Rows", category: "Pull", equipmentType: "dumbbell", barbellId: null },
	{ name: "Dumbbell Press", category: "Push", equipmentType: "dumbbell", barbellId: null },
	{ name: "Dumbbell Curls", category: "Pull", equipmentType: "dumbbell", barbellId: null },
	{ name: "Leg Extensions", category: "Legs", equipmentType: "machine", barbellId: null },
	{ name: "Leg Curls", category: "Legs", equipmentType: "machine", barbellId: null },
	{ name: "Cable Rows", category: "Pull", equipmentType: "cable", barbellId: null },
	{ name: "Cable Flyes", category: "Push", equipmentType: "cable", barbellId: null },
	{ name: "Push-ups", category: "Push", equipmentType: "bodyweight", barbellId: null },
	{ name: "Planks", category: "Core", equipmentType: "bodyweight", barbellId: null },
	{ name: "Crunches", category: "Core", equipmentType: "bodyweight", barbellId: null },
];


const commonBarbells = [
	{ name: "Standard Barbell", weight: 45 },
	{ name: "Women's Barbell", weight: 35 },
	{ name: "Training Barbell", weight: 25 },
	{ name: "EZ Curl Bar", weight: 20 },
	{ name: "Trap Bar", weight: 45 },
];


const commonPlates = [
	{ weight: 45, pairs: 4 },
	{ weight: 35, pairs: 2 },
	{ weight: 25, pairs: 2 },
	{ weight: 10, pairs: 2 },
	{ weight: 5, pairs: 4 },
];

export async function main() {
	// insert if table is empty
	if ((await db.select().from(barbells).limit(1).get()) === undefined) {
		await db.insert(barbells).values(commonBarbells);
	}
	if ((await db.select().from(exercises).limit(1).get()) === undefined) {
		await db.insert(exercises).values(commonExercises);
	}
	if ((await db.select().from(plates).limit(1).get()) === undefined) {
		await db.insert(plates).values(commonPlates);
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
if (process.argv[1]?.endsWith('seed.ts')) {
	main().catch(console.error);
}