import { NextRequest } from "next/server";
import { dataClient } from "@/lib/dataClient";
import { Plate, InsertablePlate, ApiResponse } from "@/lib/types";

export async function GET(): Promise<ApiResponse<Plate[]>> {
	try {
		const plates = await dataClient.plates.get();
		return { data: plates, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}

export async function POST(request: NextRequest): Promise<ApiResponse<Plate>> {
	try {
		const body = await request.json();
		const plate = await dataClient.plates.create(body as InsertablePlate);
		return { data: plate, error: undefined };
	} catch (error) {
		return { data: undefined, error: error as Error };
	}
}