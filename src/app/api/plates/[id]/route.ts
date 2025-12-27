import { NextRequest } from "next/server";
import { dataClient } from "@/lib/dataClient";
import { Plate, ApiResponse } from "@/lib/types";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: number; }>; }): Promise<ApiResponse<Plate | null>> {
	const { id } = await params;
	try {
		const plate = await dataClient.plates.getById(id);
		return { data: plate, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: number; }>; }): Promise<ApiResponse<Plate | null>> {
	const { id } = await params;
	try {
		const body = await request.json();
		const plate = await dataClient.plates.update(id, body as Plate);
		return { data: plate, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: number; }>; }): Promise<ApiResponse<void>> {
	const { id } = await params;
	try {
		await dataClient.plates.delete(id);
		return { data: undefined, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}