import { reset } from "@/db/reset";
import { main } from "@/db/seed";
import { execSync } from "node:child_process";

export async function setup() {

	execSync("npm run drizzle:push");
	await reset();
	await main();

	return async function teardown() {
		await reset();
	};
}

