import { NextRequest } from "next/server";
import { dataClient } from "@/lib/dataClient";
import { Session, ApiResponse } from "@/lib/types";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: number; }>; }): Promise<ApiResponse<Session | null>> {
	const { id } = await params;
	try {
		const session = await dataClient.sessions.getById(id);
		return { data: session, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: number; }>; }): Promise<ApiResponse<Session | null>> {
	const { id } = await params;
	try {
		const body = await request.json();
		const session = await dataClient.sessions.update(id, body as Session);
		return { data: session, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: number; }>; }): Promise<ApiResponse<void>> {
	const { id } = await params;
	try {
		await dataClient.sessions.delete(id);
		return { data: undefined, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}