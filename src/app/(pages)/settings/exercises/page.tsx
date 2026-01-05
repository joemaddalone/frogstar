export const dynamic = "force-dynamic";
import { Header } from "@/components/Header";
import { api } from "@/lib/api";
import { ExerciseCard } from "../_components/ExerciseCard";
export default async function ExercisesPage() {
	const { data: exercises, error } = await api.exercises.list();
	if (!exercises) {
		return <div>Exercises not found</div>;
	}
	return (
		<>
			<Header label="settings/exercises" backPath="/settings" />

			{exercises.map((exercise) => (
				<ExerciseCard key={exercise.id} exercise={exercise} />
			))}
		</>
	);
}