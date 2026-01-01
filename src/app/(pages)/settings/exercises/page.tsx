export const dynamic = "force-dynamic";
import { api } from "@/lib/api";
export default async function ExercisesPage() {
	const { data: exercises, error } = await api.exercises.list();
	if (!exercises) {
		return <div>Exercises not found</div>;
	}
	return (
		<>
			<h1 className="text-2xl font-bold">Exercises</h1>
			{exercises.map((exercise) => (
				<div key={exercise.id}>{exercise.name} - {exercise.equipmentType}</div>
			))}
		</>
	);
}