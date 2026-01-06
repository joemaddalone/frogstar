import { db } from "@/lib/client/database/database";
import { Session, InsertableSession, SessionWithDetails, ActualSet, PlannedSet } from "@/lib/types";
import { sessions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function create(session: InsertableSession): Promise<Session> {
	if (typeof session.date === "string") {
		session.date = new Date(session.date);
	}
	const result = await db.insert(sessions).values(session).returning();
	return result[0];
}

export async function get(): Promise<SessionWithDetails[]> {
	const result = await db.query.sessions.findMany({
		with: {
			plannedSets: {
				with: {
					exercise: true,
					actualSets: true,
				},
			},
		},
	});

	return result.map(enrichSession);
}

function enrichSession(session: Session & { plannedSets: (PlannedSet & { actualSets: ActualSet[]; })[]; }): SessionWithDetails {
	const planned_exercises = session.plannedSets.length;
	const completed_sets = session.plannedSets.reduce((acc: number, ps) => acc + ps.actualSets.length, 0);
	const planned_sets = session.plannedSets.reduce((acc: number, ps) => acc + ps.intendedSets, 0);
	return {
		...session,
		planned_exercises,
		completed_sets,
		planned_sets,
	} as SessionWithDetails;
}


export async function getById(id: number): Promise<SessionWithDetails | null> {
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

	if (!result) return null;

	return enrichSession(result);
}

export async function update(id: number, session: InsertableSession): Promise<Session | null> {
	if (typeof session.date === "string") {
		session.date = new Date(session.date);
	}
	const result = await db.update(sessions).set(session).where(eq(sessions.id, id)).returning();
	return result[0] ?? null;
}

export async function remove(id: number): Promise<void> {
	await db.delete(sessions).where(eq(sessions.id, id));
}
