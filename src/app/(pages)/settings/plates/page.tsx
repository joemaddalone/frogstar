export const dynamic = "force-dynamic";
import { api } from "@/lib/api";
export default async function PlatesPage() {
	const { data: plates, error } = await api.plates.list();
	if (!plates) {
		return <div>Plates not found</div>;
	}
	return (
		<div className="min-h-screen">
			<h1 className="text-2xl font-bold">Plates</h1>
			{plates.map((plate) => (
				<div key={plate.id}>{plate.weight} lbs - {plate.pairs} pairs</div>
			))}
		</div>
	);
}