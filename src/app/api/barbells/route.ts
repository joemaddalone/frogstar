import { NextRequest } from "next/server";
import { dataClient } from "@/lib/dataClient";
import { Barbell, InsertableBarbell } from "@/lib/types";
import { ApiResponse } from "@/lib/types";

export async function GET(): Promise<ApiResponse<Barbell[]>> {
	try {
		const barbells = await dataClient.barbells.get();
		return { data: barbells, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}

export async function POST(request: NextRequest): Promise<ApiResponse<Barbell>> {
	try {
		const body = await request.json();
		const barbell = await dataClient.barbells.create(body as InsertableBarbell);
		return { data: barbell, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}
