export const dynamic = "force-dynamic";
import { api } from "@/lib/api";
export default async function BarbellsPage() {
	const { data: barbells, error } = await api.barbells.list();
	if (!barbells) {
		return <div>Barbells not found</div>;
	}
	return (
		<div className="min-h-screen">
			<h1 className="text-2xl font-bold">barbells</h1>
			{barbells.map((barbell) => (
				<div key={barbell.id}>{barbell.name} - {barbell.weight} lbs</div>
			))}
		</div>
	);
}