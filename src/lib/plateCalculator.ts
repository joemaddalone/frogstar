import { Barbell, Plate, Exercise } from "@/lib/types";
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

	const availablePlates = plates.map((plate) => ({
		weight: plate.weight,
		count: plate.pairs * 2,
	}));

	if (targetWeight <= barWeight) {
		return [];
	}
	let oneSide = (targetWeight - barWeight) / 2;
	const result: { [key: number]: number; } = {};
	for (let i = 0; i < availablePlates.length; i++) {
		const plate = availablePlates[i];
		if (oneSide < plate.weight) {
			continue;
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
	}));
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
	if (exercise.equipmentType === "barbell" && barbells.length > 0) {
		try {
			const result =
				`1x${barbells[0].weight} barbell, ` +
				requiredPlates
					.map((plate) => `${plate.count}x${plate.weight}`)
					.join(", ");
			return result;
		} catch (error) {
			console.error("error", error);
			return "error";
		}
	}
	return requiredPlates
		.map((plate) => `${plate.count}x${plate.weight}`)
		.join(", ");
};
