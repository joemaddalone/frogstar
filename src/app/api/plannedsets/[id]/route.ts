import { NextRequest } from "next/server";
import { dataClient } from "@/lib/dataClient";
import { PlannedSet, ApiResponse } from "@/lib/types";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: number; }>; }): Promise<ApiResponse<PlannedSet | null>> {
	const { id } = await params;
	try {
		const plannedSet = await dataClient.planned_sets.getById(id);
		return { data: plannedSet, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: number; }>; }): Promise<ApiResponse<PlannedSet | null>> {
	const { id } = await params;
	try {
		const body = await request.json();
		const plannedSet = await dataClient.planned_sets.update(id, body as PlannedSet);
		return { data: plannedSet, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: number; }>; }): Promise<ApiResponse<void>> {
	const { id } = await params;
	try {
		await dataClient.planned_sets.delete(id);
		return { data: undefined, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}