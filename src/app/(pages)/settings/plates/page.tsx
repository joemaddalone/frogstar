export const dynamic = "force-dynamic";
import { api } from "@/lib/api";
import { PlateCard } from "@/app/(pages)/settings/_components/PlateCard";
import { Header } from "@/components/Header";
export default async function PlatesPage() {
	const { data: plates, error } = await api.plates.list();
	if (!plates) {
		return <div>Plates not found</div>;
	}
	return (
		<>
			<Header label="settings/plates" backPath="/settings" />
			{plates.map((plate) => (
				<PlateCard key={plate.id} plate={plate} />
			))}
		</>
	);
}