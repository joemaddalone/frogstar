import { describe, it, expect, beforeEach } from "vitest";
import { exportData, importData, resetData } from "./data";
import { db } from "./database";
import { sessions } from "@/db/schema";

describe("data export/import", () => {
	beforeEach(async () => {
		await resetData();
	});

	it("should export and import session dates as milliseconds", async () => {
		// Normalize to seconds as SQLite integer/timestamp mode often truncates
		const testDate = new Date();
		testDate.setMilliseconds(0);

		// Insert a session
		await db.insert(sessions).values({
			date: testDate,
			notes: "Test session",
			finished: true,
		});

		// Export data
		const exported = await exportData();

		// Verify exported session date is a number (ms)
		expect(typeof exported.sessions[0].date).toBe("number");
		expect(exported.sessions[0].date).toBe(testDate.getTime());

		// Clear data and import
		await resetData();
		await importData(exported as any);

		// Verify imported session date is a Date object and matches the exported value
		const allSessions = await db.select().from(sessions);
		expect(allSessions).toHaveLength(1);
		expect(allSessions[0].date).toBeInstanceOf(Date);
		expect(allSessions[0].date.getTime()).toBe(testDate.getTime());
	});
});
