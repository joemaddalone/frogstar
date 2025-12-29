import {
	ApiResponse,
	Plate,
	Barbell,
	Exercise,
	PlannedSet,
	ActualSet,
	SessionWithDetails,
	Session,
	InsertablePlate,
	InsertableBarbell,
	InsertableExercise,
	InsertablePlannedSet,
	InsertableActualSet,
	InsertableSession,
} from "@/lib/types";


// Detect host and port for API calls
// Client-side (browser): Use relative URLs so browser uses whatever port it's accessing (5150 in Docker)
// Server-side: Use localhost with PORT env var (3000 in Docker, internal container port)
const isClient = typeof window !== "undefined";
const host = isClient
	? "" // Relative URL - browser will use current host/port
	: `http://${process.env.HOST || "localhost"}:${process.env.PORT || 3000}`;

const tryCatch = async function <T>(
	promise: Promise<Response>
): Promise<ApiResponse<T>> {
	try {
		const response = await promise;
		if (!response.ok) {
			const text = await response.text();
			return {
				data: undefined,
				error: new Error(`HTTP error! status: ${response.status}, body: ${text}`),
			};
		}
		const data = await response.json();
		return {
			data: data.data,
			error: data.error ? new Error(data.error) : undefined,
		};
	} catch (error) {
		console.error("API error:", error);
		return { data: undefined, error: error as Error };
	}
};

export const api = {
	plates: {
		get: (id: number) => tryCatch<Plate>(fetch(`${host}/api/plates/${id}`)),
		list: () => tryCatch<Plate[]>(fetch(`${host}/api/plates`)),
		create: (plate: InsertablePlate) =>
			tryCatch<Plate>(
				fetch(`${host}/api/plates`, {
					method: "POST",
					body: JSON.stringify(plate),
				})
			),
		update: (plate: Plate) =>
			tryCatch<Plate>(
				fetch(`${host}/api/plates/${plate.id}`, {
					method: "PUT",
					body: JSON.stringify(plate),
				})
			),
		delete: (id: number) =>
			tryCatch<void>(fetch(`${host}/api/plates/${id}`, { method: "DELETE" })),
	},
	barbells: {
		get: (id: number) => tryCatch<Barbell>(fetch(`${host}/api/barbells/${id}`)),
		list: () => tryCatch<Barbell[]>(fetch(`${host}/api/barbells`)),
		create: (barbell: InsertableBarbell) =>
			tryCatch<Barbell>(
				fetch(`${host}/api/barbells`, {
					method: "POST",
					body: JSON.stringify(barbell),
				})
			),
		update: (barbell: Barbell) =>
			tryCatch<Barbell>(
				fetch(`${host}/api/barbells/${barbell.id}`, {
					method: "PUT",
					body: JSON.stringify(barbell),
				})
			),
		delete: (id: number) =>
			tryCatch<void>(fetch(`${host}/api/barbells/${id}`, { method: "DELETE" })),
	},
	exercises: {
		get: (id: number) =>
			tryCatch<Exercise>(fetch(`${host}/api/exercises/${id}`)),
		list: () => tryCatch<Exercise[]>(fetch(`${host}/api/exercises`)),
		create: (exercise: InsertableExercise) =>
			tryCatch<Exercise>(
				fetch(`${host}/api/exercises`, {
					method: "POST",
					body: JSON.stringify(exercise),
				})
			),
		update: (exercise: Exercise) =>
			tryCatch<Exercise>(
				fetch(`${host}/api/exercises/${exercise.id}`, {
					method: "PUT",
					body: JSON.stringify(exercise),
				})
			),
		delete: (id: number) =>
			tryCatch<void>(
				fetch(`${host}/api/exercises/${id}`, { method: "DELETE" })
			),
	},
	planned_sets: {
		get: (id: number) =>
			tryCatch<PlannedSet>(fetch(`${host}/api/plannedsets/${id}`)),
		list: () => tryCatch<PlannedSet[]>(fetch(`${host}/api/plannedsets`)),
		create: (planned_set: InsertablePlannedSet) =>
			tryCatch<PlannedSet>(
				fetch(`${host}/api/plannedsets`, {
					method: "POST",
					body: JSON.stringify(planned_set),
				})
			),
		update: (planned_set: PlannedSet) =>
			tryCatch<PlannedSet>(
				fetch(`${host}/api/plannedsets/${planned_set.id}`, {
					method: "PUT",
					body: JSON.stringify(planned_set),
				})
			),
		delete: (id: number) =>
			tryCatch<void>(
				fetch(`${host}/api/plannedsets/${id}`, { method: "DELETE" })
			),
	},
	actual_sets: {
		get: (id: number) =>
			tryCatch<ActualSet>(fetch(`${host}/api/actualsets/${id}`)),
		list: () => tryCatch<ActualSet[]>(fetch(`${host}/api/actualsets`)),
		create: (actual_set: InsertableActualSet) =>
			tryCatch<ActualSet>(
				fetch(`${host}/api/actualsets`, {
					method: "POST",
					body: JSON.stringify(actual_set),
				})
			),
		update: (actual_set: ActualSet) =>
			tryCatch<ActualSet>(
				fetch(`${host}/api/actualsets/${actual_set.id}`, {
					method: "PUT",
					body: JSON.stringify(actual_set),
				})
			),
		delete: (id: number) =>
			tryCatch<void>(
				fetch(`${host}/api/actualsets/${id}`, { method: "DELETE" })
			),
	},
	sessions: {
		get: (id: number) =>
			tryCatch<SessionWithDetails>(fetch(`${host}/api/sessions/${id}`)),
		list: () => tryCatch<Session[]>(fetch(`${host}/api/sessions`)),
		create: (session: InsertableSession) =>
			tryCatch<Session>(
				fetch(`${host}/api/sessions`, {
					method: "POST",
					body: JSON.stringify(session),
				})
			),
		update: (session: Session) =>
			tryCatch<Session>(
				fetch(`${host}/api/sessions/${session.id}`, {
					method: "PUT",
					body: JSON.stringify(session),
				})
			),
		delete: (id: number) =>
			tryCatch<void>(fetch(`${host}/api/sessions/${id}`, { method: "DELETE" })),
	},
};
