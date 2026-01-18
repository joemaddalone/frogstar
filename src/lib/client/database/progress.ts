import { db } from "@/lib/client/database/database";
import { actualSets, plannedSets, sessions } from "@/db/schema";
import { eq, gte, sql, and, isNotNull, asc } from "drizzle-orm";


type DiffRange = 0 | 30 | 90 | 180 | 365;

const getStartDate = (int: DiffRange) => {
	const date = new Date();
	const dateDiff = int === 0 ? 9999 : int;
	date.setDate(date.getDate() - dateDiff);
	return date;
};

export const progressByWeight = async (range: DiffRange, exerciseId?: number) => {
	const startDate = getStartDate(range);
	const result = await db.select({
		sessionId: sessions.id,
		date: sessions.date,
		max_weight: sql<number>`MAX(${actualSets.actualWeight})`,
	}).from(actualSets)
		.innerJoin(plannedSets, eq(actualSets.plannedSetId, plannedSets.id))
		.innerJoin(sessions, eq(plannedSets.sessionId, sessions.id))
		.where(
			and(
				isNotNull(actualSets.actualWeight),
				gte(sessions.date, startDate),
				exerciseId ? eq(plannedSets.exerciseId, exerciseId) : undefined
			)
		)
		.groupBy(sessions.id)
		.orderBy(asc(sessions.date));

	return result;
};