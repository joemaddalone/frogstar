import { db } from "@/lib/database";
import { Exercise, InsertableExercise } from "@/lib/types";
import { exercises } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createExercise(exercise: InsertableExercise): Promise<Exercise> {
	const result = await db.insert(exercises).values(exercise).returning();
	return result[0];
}

export async function getExercises(): Promise<Exercise[]> {
	return await db.select().from(exercises);
}

export async function getExercise(id: number): Promise<Exercise | null> {
	const result = await db.select().from(exercises).where(eq(exercises.id, id)).get();
	return result ?? null;
}

export async function updateExercise(id: number, exercise: InsertableExercise): Promise<Exercise | null> {
	const result = await db.update(exercises).set(exercise).where(eq(exercises.id, id)).returning();
	return result[0] ?? null;
}

export async function deleteExercise(id: number): Promise<void> {
	await db.delete(exercises).where(eq(exercises.id, id));
}