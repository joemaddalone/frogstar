// populate database with mock data

import { reset } from "./reset";
import { main as seed } from "./seed";
import dataClient from "@/lib/client/database";
import { db } from "@/lib/client/database/database";
import { actualSets, sessions, plannedSets } from "./schema";


const randomInt = (min: number, max: number, roundToNearest: number = 1) => {
	const random = Math.floor(Math.random() * (max - min + 1) + min);
	const result = Math.floor(random / roundToNearest) * roundToNearest;
	return result;
};

const daysToSeed = 300;

const mock = async () => {
	await reset();
	await seed();
	await db.delete(actualSets);
	await db.delete(plannedSets);
	await db.delete(sessions);

	const today = new Date();
	const startDate = new Date(today);
	startDate.setDate(startDate.getDate() - daysToSeed);

	const exercisesData = await dataClient.exercises.get();
	const exercises = exercisesData.filter((exercise) => exercise.equipmentType !== "bodyweight");

	for (let i = 0; i < daysToSeed; i++) {
		const date = new Date(startDate);
		date.setDate(startDate.getDate() + i);
		const session = await dataClient.sessions.create({ date });
		const numberOfExercises = randomInt(1, 5);
		let weight = 0;
		for (let j = 0; j < numberOfExercises; j++) {
			const sets = randomInt(1, 5);
			const reps = randomInt(1, 12);
			const exercise = exercises[randomInt(0, exercises.length - 1)];
			weight = randomInt(95, 305, 5);
			const plannedSet = await dataClient.planned_sets.create({
				sessionId: session.id,
				exerciseId: exercise.id,
				intendedReps: reps,
				intendedSets: sets,
				targetWeight: exercise.equipmentType === "bodyweight" ? undefined : weight,
			});

			for (let j = 0; j < sets; j++) {
				await dataClient.actual_sets.create({
					plannedSetId: plannedSet.id,
					actualReps: reps,
					actualWeight: exercise.equipmentType === "bodyweight" ? undefined : weight,
				});
			}
		}
	}
};


// Only run if this file is executed directly
if (process.argv[1]?.endsWith('mock.ts')) {
	mock().catch(console.error);
}
