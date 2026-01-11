import { db } from "@/lib/client/database/database";
import { actualSets, plannedSets, sessions } from "@/db/schema";
import { eq, gte, sql, and, isNotNull, asc } from "drizzle-orm";


export const progressByWeight = async (range: number, exerciseId?: number) => {
	// range
	//30 = last 30 days
	// 90 = last 90 days
	// 180 = last 180 days
	// 365 = last 365 days
	// 0 = all time
	const startDate = new Date();
	switch (range) {
		case 0:
			startDate.setDate(startDate.getDate() - 9999);
			break;
		case 30:
			startDate.setDate(startDate.getDate() - 30);
			break;
		case 90:
			startDate.setDate(startDate.getDate() - 90);
			break;
		case 180:
			startDate.setDate(startDate.getDate() - 180);
			break;
		case 365:
			startDate.setDate(startDate.getDate() - 365);
			break;
		default:
			startDate.setDate(startDate.getDate() - 30);
			break;
	}

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