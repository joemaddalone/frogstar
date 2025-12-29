"use client";
import { PlannedSet, ActualSet, Exercise } from "@/lib/types";
import { useState, use } from "react";
import { ActualSetForm } from "./ActualSetForm";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Plate, Barbell } from "@/lib/types";
import { renderCalculatedPlates } from "@/lib/plateCalculator";
import { WarmUpSets } from "./WarmupSets";
export const PlannedSetCard = ({
	plannedSet,
	equipmentLoader,
}: {
	plannedSet: PlannedSet & { exercise: Exercise; actualSets: ActualSet[]; };
	equipmentLoader: Promise<{ plates: Plate[]; barbells: Barbell[]; }>;
}) => {
	const [showActualSetForm, setShowActualSetForm] = useState(false);
	const [showEditActualSetForm, setShowEditActualSetForm] = useState(0);
	const equipment = use(equipmentLoader);
	const router = useRouter();

	const deletePlannedSet = async () => {
		const { error } = await api.planned_sets.delete(plannedSet.id);
		if (!error) {
			router.refresh();
		}
	};

	const deleteActualSet = async (actualSetId: number) => {
		const { error } = await api.actual_sets.delete(actualSetId);
		if (!error) {
			router.refresh();
		}
	};

	const logAllSets = async () => {
		for (let i = 0; i < plannedSet.intendedSets; i++) {
			const { error } = await api.actual_sets.create({
				plannedSetId: plannedSet.id,
				actualReps: plannedSet.intendedReps,
				actualWeight: plannedSet.targetWeight,
			});
			if (error) {
				console.error(error);
			}
		}
		router.refresh();
	};

	const platesNeeded = renderCalculatedPlates(
		plannedSet.exercise,
		plannedSet.targetWeight || 0,
		equipment.plates,
		equipment.barbells
	);

	console.log("platesNeeded", platesNeeded);

	return (
		<div className="mx-5 mt-4">
			<div className="flex flex-col gap-2 p-2 border border-gray-200 rounded">
				{plannedSet.exercise.name}
				<div className="flex gap-2">
					Planned Sets: {plannedSet.intendedSets} x {plannedSet.intendedReps} @{" "}
					{plannedSet.targetWeight} lbs
				</div>
				<div className="flex gap-2">{platesNeeded}</div>
				{plannedSet.targetWeight && plannedSet.targetWeight > 0 && (
					<WarmUpSets
						targetWeight={plannedSet.targetWeight}
						equipmentType={plannedSet.exercise.equipmentType}
					/>
				)}
				<div className="">
					Actual Sets:
					<br />
					{plannedSet.actualSets.length === 0 ? (
						<div>No actual sets yet</div>
					) : (
						<div className="flex w-100 flex-col gap-2">
							{plannedSet.actualSets.map((actualSet) => (
								<div
									key={actualSet.id}
									className="flex gap-2 items-center border-b pb-2"
								>
									{actualSet.actualReps} @ {actualSet.actualWeight} lbs{" "}
									<button
										onClick={() => setShowEditActualSetForm(actualSet.id)}
										className="btn-primary btn-sm"
									>
										Edit
									</button>{" "}
									<button
										onClick={() => deleteActualSet(actualSet.id)}
										className="btn-danger btn-sm"
									>
										Delete
									</button>
								</div>
							))}
						</div>
					)}
				</div>
				<div className="flex gap-2">
					<button
						className="btn-primary btn-sm"
						onClick={() => setShowActualSetForm(true)}
					>
						Log Actual Set
					</button>
					{plannedSet.actualSets.length === 0 && (
						<button className="btn-primary btn-sm" onClick={logAllSets}>
							Log All Sets ({plannedSet.intendedSets})
						</button>
					)}
					<button className="btn-danger btn-sm" onClick={deletePlannedSet}>
						Delete Planned Set
					</button>
				</div>
				{showActualSetForm && (
					<ActualSetForm
						plannedSet={plannedSet}
						cancel={() => setShowActualSetForm(false)}
					/>
				)}
				{showEditActualSetForm > 0 && (
					<ActualSetForm
						plannedSet={plannedSet}
						actualSetId={showEditActualSetForm}
						cancel={() => setShowEditActualSetForm(0)}
					/>
				)}
			</div>
		</div>
	);
};
