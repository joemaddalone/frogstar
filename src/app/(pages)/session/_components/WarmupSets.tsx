// import { renderCalculatedPlates } from "@/lib/plateCalculator";
import type { Exercise, Plate, Barbell } from "@/lib/types";
// import { useTranslations } from "next-intl";
import { PlateViz } from "@/components/PlateViz";


export type WarmUpSet = {
	weight: number;
	reps: number;
	percentage: number;
};

interface WarmUpSetsProps {
	targetWeight: number;
	exercise: Exercise;
	plates: Plate[];
	barbells: Barbell[];
	equipmentType: string;
	className?: string;
}

export const calculateWarmUpSets = (targetWeight: number, equipmentType: string = 'barbell', exercise: Exercise, _plates: Plate[], barbells: Barbell[]): WarmUpSet[] => {
	if (!targetWeight) return [];

	let minWeight = 0;
	let percentages = [0.4, 0.6, 0.75, 0.85];

	// Set minimum weight based on equipment type
	switch (equipmentType) {
		case 'barbell':
			minWeight = barbells.find((barbell) => barbell.id === exercise.barbellId)?.weight || 0;
			break;
		case 'dumbbell':
			minWeight = 5; // Lightest dumbbells
			percentages = [0.4, 0.5, 0.6, 0.7]; // Lower percentages for dumbbells
			break;
		case 'machine':
			minWeight = 10; // Machine minimum
			percentages = [0.4, 0.5, 0.6, 0.7];
			break;
		case 'cable':
			minWeight = 5; // Cable minimum
			percentages = [0.4, 0.5, 0.6, 0.7];
			break;
		case 'bodyweight':
			return []; // No warm-up sets for bodyweight exercises
		default:
			minWeight = 0;
	}

	if (targetWeight <= minWeight) return [];

	const warmUps: WarmUpSet[] = [];

	const getReps = (percentage: number) => {
		if (percentage >= .8) return 3;
		if (percentage >= .6) return 5;
		return 8;
	};

	for (const percentage of percentages) {
		const calculatedWeight = targetWeight * percentage;
		// Round to nearest 5 pounds for barbell, nearest 2.5 for others
		const roundTo = equipmentType === 'barbell' ? 5 : 2.5;
		const weight = Math.round(calculatedWeight / roundTo) * roundTo;

		if (weight >= minWeight && weight < targetWeight) {
			warmUps.push({
				weight,
				reps: getReps(percentage),
				percentage: Math.round(percentage * 100)
			});
		}
	}

	return warmUps;
};

export const WarmUpSets = (props: WarmUpSetsProps) => {
	// const t = useTranslations();
	const { targetWeight, exercise, plates, barbells, equipmentType, className = '' } = props;
	const warmUpSets = calculateWarmUpSets(targetWeight, equipmentType, exercise, plates, barbells);
	const barWeight = barbells.find((barbell) => barbell.id === exercise.barbellId)?.weight || 0;

	return (
		<div className={`mb-2 ${className}`}>
			{/* <div className="text-xs mb-1">{t('common.warmups')}:</div> */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
				{warmUpSets.map((warmUp) => (
					<div key={warmUp.weight} className="indicator flex flex-col items-center gap-2 text-sm px-2 py-1 rounded border border-base-content/10 rounded-sm w-full">
						<div >
							<div className="text-xs text-center font-bold">{warmUp.weight} ({warmUp.percentage}%) × {warmUp.reps}</div>

							<PlateViz
								size="sm"
								plates={plates}
								bar={barWeight}
								target={warmUp.weight || 0}
							/>
						</div>

					</div>
				))}
			</div>
		</div>
	);
};

