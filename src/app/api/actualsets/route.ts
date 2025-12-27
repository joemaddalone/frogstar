import { dataClient } from "@/lib/dataClient";
import { NextRequest } from "next/server";
import { ActualSet, InsertableActualSet, ApiResponse } from "@/lib/types";

export async function GET(): Promise<ApiResponse<ActualSet[]>> {
	try {
		const actualSets = await dataClient.actual_sets.get();
		return { data: actualSets, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}

export async function POST(request: NextRequest): Promise<ApiResponse<ActualSet>> {
	try {
		const body = await request.json();
		const actualSet = await dataClient.actual_sets.create(body as InsertableActualSet);
		return { data: actualSet, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}