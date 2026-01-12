import type {
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

const tryCatch = async <T>(
  promise: Promise<Response>,
): Promise<ApiResponse<T>> => {
  try {
    const response = await promise;
    if (!response.ok) {
      const text = await response.text();
      return {
        data: undefined,
        error: new Error(
          `HTTP error! status: ${response.status}, body: ${text}`,
        ),
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

const createClientEndpoints = <T, R, I>(path: string) => {
  return {
    get: (id: number) => tryCatch<R>(fetch(`${host}/api/${path}/${id}`)),
    list: () => tryCatch<T[]>(fetch(`${host}/api/${path}`)),
    create: (item: I) =>
      tryCatch<T>(
        fetch(`${host}/api/${path}`, {
          method: "POST",
          body: JSON.stringify(item),
        }),
      ),
    update: (item: T & { id: number; }) =>
      tryCatch<T>(
        fetch(`${host}/api/${path}/${item.id}`, {
          method: "PUT",
          body: JSON.stringify(item),
        }),
      ),
    delete: (id: number) =>
      tryCatch<void>(fetch(`${host}/api/${path}/${id}`, { method: "DELETE" })),
  };
};

const progressClientEndpoints = {
  progressByWeight: (range: number, exerciseId?: number) =>
    tryCatch<{ sessionId: number; date: string | number; max_weight: number; }[]>(
      fetch(`${host}/api/progress/${range}/exercise/${exerciseId}`),
    ),
};

export const api = {
  progress: progressClientEndpoints,
  plates: createClientEndpoints<Plate, Plate, InsertablePlate>("plates"),
  barbells: createClientEndpoints<Barbell, Barbell, InsertableBarbell>(
    "barbells",
  ),
  exercises: createClientEndpoints<Exercise, Exercise, InsertableExercise>(
    "exercises",
  ),
  planned_sets: createClientEndpoints<
    PlannedSet,
    PlannedSet,
    InsertablePlannedSet
  >("plannedsets"),
  actual_sets: createClientEndpoints<ActualSet, ActualSet, InsertableActualSet>(
    "actualsets",
  ),
  sessions: createClientEndpoints<
    Session,
    SessionWithDetails,
    InsertableSession
  >("sessions"),
  data: {
    exportData: () => tryCatch<SessionWithDetails[]>(fetch(`${host}/api/data/export`)),
    importData: (data: unknown) => tryCatch<boolean>(fetch(`${host}/api/data/import`, {
      method: "POST",
      body: JSON.stringify(data),
    })),
    resetData: () => tryCatch<boolean>(fetch(`${host}/api/data/reset`, {
      method: "POST",
    })),
  },
};
