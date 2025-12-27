import { dataClient } from "@/lib/dataClient";
import { PlannedSet, InsertablePlannedSet, ApiResponse } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(): Promise<ApiResponse<PlannedSet[]>> {
	try {
		const plannedSets = await dataClient.planned_sets.get();
		return { data: plannedSets, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}

export async function POST(request: NextRequest): Promise<ApiResponse<PlannedSet>> {
	try {
		const body = await request.json();
		const plannedSet = await dataClient.planned_sets.create(body as InsertablePlannedSet);
		return { data: plannedSet, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}