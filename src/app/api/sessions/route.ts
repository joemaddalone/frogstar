import { NextRequest } from "next/server";
import { dataClient } from "@/lib/dataClient";
import { Session, SessionWithDetails, ApiResponse } from "@/lib/types";

export async function GET(): Promise<ApiResponse<SessionWithDetails[]>> {
	try {
		const sessions = await dataClient.sessions.get();
		return { data: sessions, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}

export async function POST(request: NextRequest): Promise<ApiResponse<Session>> {
	try {
		const body = await request.json();
		const session = await dataClient.sessions.create(body as Session);
		return { data: session, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}