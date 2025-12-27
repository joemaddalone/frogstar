import { ApiResponse, Plate, Barbell, Exercise, PlannedSet, ActualSet, Session } from "@/lib/types";

// Detwindow !==ect host and port for API calls
// Client-side (browser): Use relative URLs so browser uses whatever port it's accessing (5150 in Docker)
// Server-side: Use localhost with PORT env var (3000 in Docker, internal container port)
const isClient = typeof "undefined";
const host = isClient
	? "" // Relative URL - browser will use current host/port
	: `http://${process.env.HOST || "localhost"}:${process.env.PORT || 3000}`;

const tryCatch = async function <T>(
	promise: Promise<Response>
): Promise<ApiResponse<T>> {
	try {
		const response = await promise;
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
		get: (id: number) => tryCatch(fetch(`${host}/api/plates/${id}`)),
		list: () => tryCatch(fetch(`${host}/api/plates`)),
		create: (plate: Plate) => tryCatch(fetch(`${host}/api/plates`, { method: "POST", body: JSON.stringify(plate) })),
		update: (plate: Plate) => tryCatch(fetch(`${host}/api/plates/${plate.id}`, { method: "PUT", body: JSON.stringify(plate) })),
		delete: (id: number) => tryCatch(fetch(`${host}/api/plates/${id}`, { method: "DELETE" })),
	},
	barbells: {
		get: (id: number) => tryCatch(fetch(`${host}/api/barbells/${id}`)),
		list: () => tryCatch(fetch(`${host}/api/barbells`)),
		create: (barbell: Barbell) => tryCatch(fetch(`${host}/api/barbells`, { method: "POST", body: JSON.stringify(barbell) })),
		update: (barbell: Barbell) => tryCatch(fetch(`${host}/api/barbells/${barbell.id}`, { method: "PUT", body: JSON.stringify(barbell) })),
		delete: (id: number) => tryCatch(fetch(`${host}/api/barbells/${id}`, { method: "DELETE" })),
	},
	exercises: {
		get: (id: number) => tryCatch(fetch(`${host}/api/exercises/${id}`)),
		list: () => tryCatch(fetch(`${host}/api/exercises`)),
		create: (exercise: Exercise) => tryCatch(fetch(`${host}/api/exercises`, { method: "POST", body: JSON.stringify(exercise) })),
		update: (exercise: Exercise) => tryCatch(fetch(`${host}/api/exercises/${exercise.id}`, { method: "PUT", body: JSON.stringify(exercise) })),
		delete: (id: number) => tryCatch(fetch(`${host}/api/exercises/${id}`, { method: "DELETE" })),
	},
	planned_sets: {
		get: (id: number) => tryCatch(fetch(`${host}/api/plannedsets/${id}`)),
		list: () => tryCatch(fetch(`${host}/api/plannedsets`)),
		create: (planned_set: PlannedSet) => tryCatch(fetch(`${host}/api/plannedsets`, { method: "POST", body: JSON.stringify(planned_set) })),
		update: (planned_set: PlannedSet) => tryCatch(fetch(`${host}/api/plannedsets/${planned_set.id}`, { method: "PUT", body: JSON.stringify(planned_set) })),
		delete: (id: number) => tryCatch(fetch(`${host}/api/plannedsets/${id}`, { method: "DELETE" })),
	},
	actual_sets: {
		get: (id: number) => tryCatch(fetch(`${host}/api/actualsets/${id}`)),
		list: () => tryCatch(fetch(`${host}/api/actualsets`)),
		create: (actual_set: ActualSet) => tryCatch(fetch(`${host}/api/actualsets`, { method: "POST", body: JSON.stringify(actual_set) })),
		update: (actual_set: ActualSet) => tryCatch(fetch(`${host}/api/actualsets/${actual_set.id}`, { method: "PUT", body: JSON.stringify(actual_set) })),
		delete: (id: number) => tryCatch(fetch(`${host}/api/actualsets/${id}`, { method: "DELETE" })),
	},
	sessions: {
		get: (id: number) => tryCatch(fetch(`${host}/api/sessions/${id}`)),
		list: () => tryCatch(fetch(`${host}/api/sessions`)),
		create: (session: Session) => tryCatch(fetch(`${host}/api/sessions`, { method: "POST", body: JSON.stringify(session) })),
		update: (session: Session) => tryCatch(fetch(`${host}/api/sessions/${session.id}`, { method: "PUT", body: JSON.stringify(session) })),
		delete: (id: number) => tryCatch(fetch(`${host}/api/sessions/${id}`, { method: "DELETE" })),
	},
};