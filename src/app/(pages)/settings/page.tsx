export const dynamic = "force-dynamic";
import SettingsPageComponent from "@/app/(pages)/settings/_components/SettingsPageComponent";
import type { Barbell } from '@/lib/types';

export default async function BarbellsPage() {

	return (
		<SettingsPageComponent
			titler={(item: Barbell) => `${item?.name} - ${item?.weight}`}
			type='barbells'
		/>
	);
}
