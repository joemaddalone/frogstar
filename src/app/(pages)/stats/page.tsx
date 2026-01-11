export const dynamic = "force-dynamic";
import { Header } from "@/components/Header";
import { api } from "@/lib/api";
import { ByWeightForm } from "./_components/ByWeightForm";
export default async function StatsPage() {
	const exercises = api.exercises.list();
	return (
		<>
			<Header label="stats" />
			<main>
				<ByWeightForm exercises={exercises} />
			</main>
		</>
	);
}
