"use client";
import { PlannedSet, ActualSet, Exercise } from "@/lib/types";
import { useState, use } from "react";
import { ActualSetForm } from "./ActualSetForm";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Plate, Barbell } from "@/lib/types";
import { renderCalculatedPlates } from "@/lib/plateCalculator";
import { WarmUpSets } from "./WarmupSets";
import {
	Card,
	CardContent,
	CardHeader,
	CardFooter,
	CardTitle,
	CardDescription,
	CardHeaderActions,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Edit, Trash, X } from "lucide-react";
export const PlannedSetCard = ({
	plannedSet,
	equipmentLoader,
}: {
	plannedSet: PlannedSet & { exercise: Exercise; actualSets: ActualSet[]; };
	equipmentLoader: Promise<{ plates: Plate[]; barbells: Barbell[]; }>;
}) => {
	const [showActualSetForm, setShowActualSetForm] = useState(false);
	const [showEditActualSetForm, setShowEditActualSetForm] = useState(0);
	const [showWarmup, setShowWarmup] = useState(false);
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

	return (
		<>
			<Card>
				<CardHeader>
					<CardHeaderActions>
						{plannedSet.exercise.equipmentType !== "bodyweight" && (
							<Button onClick={() => setShowWarmup(!showWarmup)} size="xs" variant="outline">{showWarmup ? "Hide" : "Show"} warmups</Button>
						)}
						<Button onClick={deletePlannedSet} size="xs" variant="danger"><Trash className="h-4 w-4" /></Button>
					</CardHeaderActions>
					<CardTitle>{plannedSet.exercise.name} <sup className="text-xs text-base-content/60">{plannedSet.exercise.category}</sup></CardTitle>
					<CardDescription>
						{plannedSet.intendedSets} x {plannedSet.intendedReps}{" "}
						@ {plannedSet.targetWeight} lbs
						{plannedSet.exercise.equipmentType !== "bodyweight" && (
							<>
								<div className="mt-1 text-xs text-base-content/60">Plates Needed:</div>
								{platesNeeded}
							</>
						)}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{showWarmup && plannedSet.targetWeight && plannedSet.targetWeight > 0 && (
						<WarmUpSets
							plates={equipment.plates}
							barbells={equipment.barbells}
							exercise={plannedSet.exercise}
							targetWeight={plannedSet.targetWeight}
							equipmentType={plannedSet.exercise.equipmentType}
						/>
					)}

					{plannedSet.actualSets.map((actualSet) => (
						<div
							key={actualSet.id}
							className="flex gap-2 items-center justify-between border-b pb-2"
						>
							{actualSet.actualReps} @ {actualSet.actualWeight} lbs{" "}
							<div>
								<Button
									onClick={() => setShowEditActualSetForm(actualSet.id)}
									size="xs"
									variant="ghost"
								>
									<Edit className="h-4 w-4" />
								</Button>
								<Button
									onClick={() => deleteActualSet(actualSet.id)}
									size="xs"
									variant="ghost"
								>
									<Trash className="h-4 w-4" />
								</Button>
							</div>
						</div>
					))}

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
				</CardContent>
				{!showActualSetForm && showEditActualSetForm === 0 ? (
					<CardFooter className="justify-center gap-2">
						<Button
							className={plannedSet.actualSets.length > 0 ? "w-90" : "w-40"}
							size="xs"
							onClick={() => setShowActualSetForm(true)}
						>
							Log Set
						</Button>
						{plannedSet.actualSets.length === 0 && (
							<Button
								className="w-40"
								size="xs"
								onClick={logAllSets}
							>
								Log All Sets ({plannedSet.intendedSets})
							</Button>
						)}
					</CardFooter>
				) : null}
			</Card>
		</>
	);
};
