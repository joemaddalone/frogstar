import { db } from "@/lib/database";
import { Session, InsertableSession, SessionWithDetails } from "@/lib/types";
import { sessions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createSession(session: InsertableSession): Promise<Session> {
	const result = await db.insert(sessions).values(session).returning();
	return result[0];
}

export async function getSessions(): Promise<SessionWithDetails[]> {
	return await db.query.sessions.findMany({
		with: {
			plannedSets: {
				with: {
					exercise: true,
					actualSets: true,
				},
			},
		},
	}) as SessionWithDetails[];
}

export async function getSession(id: number): Promise<SessionWithDetails | null> {
	const result = await db.query.sessions.findFirst({
		with: {
			plannedSets: {
				with: {
					exercise: true,
					actualSets: true,
				},
			},
		},
		where: eq(sessions.id, id),
	});

	return result as SessionWithDetails ?? null;
}

export async function updateSession(id: number, session: InsertableSession): Promise<Session | null> {
	const result = await db.update(sessions).set(session).where(eq(sessions.id, id)).returning();
	return result[0] ?? null;
}

export async function deleteSession(id: number): Promise<void> {
	await db.delete(sessions).where(eq(sessions.id, id));
}
