import type { Barbell, Plate, Exercise } from "@/lib/types";
import { api } from "@/lib/api";

export const loadPlateCalculatorSettings = async (): Promise<{
	barbells: Barbell[];
	plates: Plate[];
}> => {
	const { data: barbells } = await api.barbells.list();
	const { data: plates } = await api.plates.list();

	return {
		barbells: barbells || [],
		plates: plates?.sort((a: Plate, b: Plate) => b.weight - a.weight) || [],
	};
};

export const justThePlates = (bar: number, target: number, plates: Plate[]) => {
	const availablePlates = plates.map((plate) => ({
		weight: plate.weight,
		count: plate.pairs * 2,
	}));

	if (target <= bar) {
		return [];
	}
	let oneSide = (target - bar) / 2;
	const result: { [key: number]: number; } = {};
	for (let i = 0; i < availablePlates.length; i++) {
		const plate = availablePlates[i];
		if (oneSide < plate.weight) {
			// do nothing
		} else {
			let count = 0;
			while (count < Math.floor(oneSide / plate.weight)) {
				count++;
				result[plate.weight] = count;
			}
			oneSide = oneSide % plate.weight;
		}
	}

	return Object.entries(result).map(([weight, count]) => ({
		weight: Number(weight),
		count: count,
	})).sort((a, b) => b.weight - a.weight);
};

export const calculateEquipment = (
	exercise: Exercise,
	targetWeight: number | 0,
	plates: Plate[],
	barbells: Barbell[]
): Array<{ weight: number; count: number; }> => {
	const barWeight =
		barbells.find((barbell) => barbell.id === exercise.barbellId)?.weight || 0;
	if (!targetWeight) {
		targetWeight = 0;
	}

	return justThePlates(barWeight, targetWeight, plates);
};

export const renderCalculatedPlates = (
	exercise: Exercise,
	targetWeight: number,
	plates: Plate[],
	barbells: Barbell[]
) => {

	const requiredPlates = calculateEquipment(
		exercise,
		targetWeight,
		plates,
		barbells
	);

	return requiredPlates
		.map((plate) => `${plate.count}x${plate.weight}`)
		.join(", ");
};
