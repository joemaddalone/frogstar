import { plannedSets } from "@/db/schema";
import { db } from "@/lib/client/database/database";
import { eq } from "drizzle-orm";

export async function deletePlannedSetsBySessionId(sessionId: number): Promise<void> {
	await db.delete(plannedSets).where(eq(plannedSets.sessionId, sessionId));
}