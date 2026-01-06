import { actualSets } from "@/db/schema";
import { db } from "@/lib/client/database/database";
import { eq } from "drizzle-orm";
import { ActualSet } from "@/lib/types";

export async function deleteActualSetsByPlannedSetId(plannedSetId: number): Promise<void> {
	await db.delete(actualSets).where(eq(actualSets.plannedSetId, plannedSetId));
}

export async function getActualSetsByPlannedSetId(plannedSetId: number): Promise<ActualSet[]> {
	return await db.select().from(actualSets).where(eq(actualSets.plannedSetId, plannedSetId));
}




