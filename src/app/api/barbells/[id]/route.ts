import { NextRequest } from "next/server";
import { dataClient } from "@/lib/dataClient";
import { Barbell, ApiResponse } from "@/lib/types";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: number; }>; }): Promise<ApiResponse<Barbell | null>> {
	const { id } = await params;
	try {
		const barbell = await dataClient.barbells.getById(id);
		return { data: barbell, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: number; }>; }): Promise<ApiResponse<Barbell | null>> {
	const { id } = await params;
	try {
		const body = await request.json();
		const barbell = await dataClient.barbells.update(id, body as Barbell);
		return { data: barbell, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}


export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: number; }>; }): Promise<ApiResponse<void>> {
	const { id } = await params;
	try {
		await dataClient.barbells.delete(id);
		return { data: undefined, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}
