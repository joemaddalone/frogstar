import { NextRequest } from "next/server";
import { dataClient } from "@/lib/dataClient";
import { Exercise, ApiResponse } from "@/lib/types";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: number; }>; }): Promise<ApiResponse<Exercise | null>> {
	const { id } = await params;
	try {
		const exercise = await dataClient.exercises.getById(id);
		return { data: exercise, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: number; }>; }): Promise<ApiResponse<Exercise | null>> {
	const { id } = await params;
	try {
		const body = await request.json();
		const exercise = await dataClient.exercises.update(id, body as Exercise);
		return { data: exercise, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: number; }>; }): Promise<ApiResponse<void>> {
	const { id } = await params;
	try {
		await dataClient.exercises.delete(id);
		return { data: undefined, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}