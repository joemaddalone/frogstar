import { dataClient } from "@/lib/dataClient";
import { Exercise, InsertableExercise, ApiResponse } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(): Promise<ApiResponse<Exercise[]>> {
	try {
		const exercises = await dataClient.exercises.get();
		return { data: exercises, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}

export async function POST(request: NextRequest): Promise<ApiResponse<Exercise>> {
	try {
		const body = await request.json();
		const exercise = await dataClient.exercises.create(body as InsertableExercise);
		return { data: exercise, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}