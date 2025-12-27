import { NextRequest } from "next/server";
import { dataClient } from "@/lib/dataClient";
import { ActualSet, ApiResponse } from "@/lib/types";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: number; }>; }): Promise<ApiResponse<ActualSet | null>> {
	const { id } = await params;
	try {
		const actualSet = await dataClient.actual_sets.getById(id);
		return { data: actualSet, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: number; }>; }): Promise<ApiResponse<ActualSet | null>> {
	const { id } = await params;
	try {
		const body = await request.json();
		const actualSet = await dataClient.actual_sets.update(id, body as ActualSet);
		return { data: actualSet, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: number; }>; }): Promise<ApiResponse<void>> {
	const { id } = await params;
	try {
		await dataClient.actual_sets.delete(id);
		return { data: undefined, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}