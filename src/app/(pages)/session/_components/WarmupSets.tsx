

export type WarmUpSet = {
	weight: number;
	reps: number;
	percentage: number;
};

interface WarmUpSetsProps {
	targetWeight: number;
	equipmentType: string;
	className?: string;
}

export const calculateWarmUpSets = (targetWeight: number, equipmentType: string = 'barbell'): WarmUpSet[] => {
	if (!targetWeight) return [];

	let minWeight = 0;
	let percentages = [0.4, 0.5, 0.6, 0.7, 0.8]; // 40%, 50%, 60%, 70%, 80%

	// Set minimum weight based on equipment type
	switch (equipmentType) {
		case 'barbell':
			minWeight = 45; // Bar weight
			break;
		case 'dumbbell':
			minWeight = 5; // Lightest dumbbells
			percentages = [0.3, 0.4, 0.5, 0.6, 0.7]; // Lower percentages for dumbbells
			break;
		case 'machine':
			minWeight = 10; // Machine minimum
			percentages = [0.3, 0.4, 0.5, 0.6, 0.7];
			break;
		case 'cable':
			minWeight = 5; // Cable minimum
			percentages = [0.3, 0.4, 0.5, 0.6, 0.7];
			break;
		case 'bodyweight':
			return []; // No warm-up sets for bodyweight exercises
		default:
			minWeight = 0;
	}

	if (targetWeight <= minWeight) return [];

	const warmUps: WarmUpSet[] = [];

	for (const percentage of percentages) {
		const calculatedWeight = targetWeight * percentage;
		// Round to nearest 5 pounds for barbell, nearest 2.5 for others
		const roundTo = equipmentType === 'barbell' ? 5 : 2.5;
		const weight = Math.round(calculatedWeight / roundTo) * roundTo;

		if (weight >= minWeight && weight < targetWeight) {
			warmUps.push({
				weight,
				reps: percentage <= 0.6 ? 8 : 5, // More reps for lighter sets
				percentage: Math.round(percentage * 100)
			});
		}
	}

	return warmUps;
};

export const WarmUpSets: React.FC<WarmUpSetsProps> = ({
	targetWeight,
	equipmentType,
	className = ''
}) => {
	const warmUpSets = calculateWarmUpSets(targetWeight, equipmentType);

	return (
		<div className={`mb-2 ${className}`}>
			<div className="text-xs mb-1">Suggested warm-ups:</div>
			<div className="space-y-1">
				{warmUpSets.map((warmUp, index) => (
					<div key={index} className="flex items-center justify-between text-xs px-2 py-1 rounded border">
						<div className="flex items-center gap-2">
							<span className="font-medium">
								{warmUp.weight} lbs ({warmUp.percentage}%) × {warmUp.reps}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

