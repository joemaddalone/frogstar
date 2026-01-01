export const dynamic = "force-dynamic";
import { api } from "@/lib/api";
import { BarbellCard } from "@/app/(pages)/settings/_components/BarbellCard";
import { Header } from "@/components/Header";
export default async function BarbellsPage() {
	const { data: barbells, error } = await api.barbells.list();
	if (!barbells) {
		return <div>Barbells not found</div>;
	}
	return (
		<>
			<Header label="settings/barbells" backPath="/settings" />
			{barbells.map((barbell) => (
				<BarbellCard key={barbell.id} barbell={barbell} />
			))}
		</>
	);
}