export const dynamic = "force-dynamic";
import SettingsPageComponent from "@/app/(pages)/settings/_components/SettingsPageComponent";
import { Data } from "@/app/(pages)/settings/_components/Data";
import type { Plate, Exercise, Barbell } from '@/lib/types';



interface PageProps {
	params: {
		section: 'plates' | 'barbells' | 'exercises' | 'data';
	};
}

const titlerMap = {
	plates: (item: Plate) => `${item.weight} - ${item.pairs} pairs`,
	barbells: (item: Barbell) => `${item?.name} - ${item?.weight}`,
	exercises: (item: Exercise) => `${item.name} (${item.category})`,
};

export default async function PlatesPage({ params }: PageProps) {
	const { section } = await params;
	if (!section) return null;

	if (section === 'data') {
		return <Data />;
	}

	return (
		<SettingsPageComponent
			titler={titlerMap[section]}
			type={section}
		/>
	);
}