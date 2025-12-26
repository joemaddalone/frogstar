import { db } from "../lib/database";
import { barbells, exercises, plates } from "./schema";

const commonExercises = [
	{
		name: "Bench Press",
		category: "Push",
		equipment_type: "barbell",
		barbell_id: 1,
	},
	{
		name: "Barbell Curls",
		category: "Pull",
		equipment_type: "barbell",
		barbell_id: 1,
	},
	{ name: "Squat", category: "Legs", equipment_type: "barbell", barbell_id: 1 },
	{
		name: "Deadlift",
		category: "Pull",
		equipment_type: "barbell",
		barbell_id: 1,
	},
	{
		name: "Overhead Press",
		category: "Push",
		equipment_type: "barbell",
		barbell_id: 1,
	},
	{
		name: "Barbell Row",
		category: "Pull",
		equipment_type: "barbell",
		barbell_id: 1,
	},
	{ name: "Pull-ups", category: "Pull", equipment_type: "bodyweight" },
	{ name: "Dips", category: "Push", equipment_type: "bodyweight" },
	{ name: "Lunges", category: "Legs", equipment_type: "bodyweight" },
	{
		name: "Romanian Deadlift",
		category: "Pull",
		equipment_type: "barbell",
		barbell_id: 1,
	},
	{ name: "Incline Bench Press", category: "Push", equipment_type: "barbell" },
	{ name: "Dumbbell Rows", category: "Pull", equipment_type: "dumbbell" },
	{ name: "Dumbbell Press", category: "Push", equipment_type: "dumbbell" },
	{ name: "Dumbbell Curls", category: "Pull", equipment_type: "dumbbell" },
	{ name: "Leg Extensions", category: "Legs", equipment_type: "machine" },
	{ name: "Leg Curls", category: "Legs", equipment_type: "machine" },
	{ name: "Cable Rows", category: "Pull", equipment_type: "cable" },
	{ name: "Cable Flyes", category: "Push", equipment_type: "cable" },
	{ name: "Push-ups", category: "Push", equipment_type: "bodyweight" },
	{ name: "Planks", category: "Core", equipment_type: "bodyweight" },
	{ name: "Crunches", category: "Core", equipment_type: "bodyweight" },
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
	if (await db.select().from(exercises).limit(1).get() === undefined) {
		await db.insert(exercises).values(commonExercises);
	}
	if (await db.select().from(barbells).limit(1).get() === undefined) {
		await db.insert(barbells).values(commonBarbells);
	}
	if (await db.select().from(plates).limit(1).get() === undefined) {
		await db.insert(plates).values(commonPlates);
	}
}

main();