import { db } from "@/lib/database";
import { Plate, InsertablePlate } from "@/lib/types";
import { plates } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createPlate(plate: InsertablePlate): Promise<Plate> {
	const result = await db.insert(plates).values(plate).returning();
	return result[0];
}

export async function getPlates(): Promise<Plate[]> {
	return await db.select().from(plates);
}

export async function getPlate(id: number): Promise<Plate | null> {
	const result = await db.select().from(plates).where(eq(plates.id, id)).get();
	return result ?? null;
}

export async function updatePlate(id: number, plate: InsertablePlate): Promise<Plate | null> {
	const result = await db.update(plates).set(plate).where(eq(plates.id, id)).returning();
	return result[0] ?? null;
}

export async function deletePlate(id: number): Promise<void> {
	await db.delete(plates).where(eq(plates.id, id));
}