export const dynamic = "force-dynamic";
import SettingsPageComponent from "@/app/(pages)/settings/_components/SettingsPageComponent";
import type { Plate, Exercise, Barbell } from '@/lib/types';

interface PageProps {
	params: {
		id?: string;
		section: 'plates' | 'barbells' | 'exercises';
	};
}

const titlerMap = {
	plates: (item: Plate) => `${item.weight} - ${item.pairs} pairs`,
	barbells: (item: Barbell) => `${item?.name} - ${item?.weight}`,
	exercises: (item: Exercise) => `${item.name} (${item.category})`,
};

export default async function SettingsGeneralPage({ params }: PageProps) {
	const { section, id } = await params;
	if (!section) return null;

	return (
		<SettingsPageComponent
			id={id}
			titler={titlerMap[section]}
			type={section}
		/>
	);
}