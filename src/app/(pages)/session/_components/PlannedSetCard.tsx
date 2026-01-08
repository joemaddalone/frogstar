"use client";
import type {
	Plate,
	Barbell,
	PlannedSet,
	ActualSet,
	Exercise,
} from "@/lib/types";
import { useState, use } from "react";
import { ActualSetForm } from "./ActualSetForm";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
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
import { Trash, ChevronRight } from "lucide-react";
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
			router.push(`/session/${plannedSet.sessionId}`);
		}
	};

	const deleteActualSet = async (actualSetId: number) => {
		const { error } = await api.actual_sets.delete(actualSetId);
		if (!error) {
			setShowEditActualSetForm(0);
			setShowActualSetForm(false);
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
		equipment.barbells,
	);

	return (
		<Card>
			<CardHeader>
				<CardHeaderActions>
					{plannedSet.exercise.equipmentType === "barbell" && (
						<Button
							onClick={() => setShowWarmup(!showWarmup)}
							size="sm"
							variant="outline"
						>
							{showWarmup ? "Hide" : "Show"} warmups
						</Button>
					)}
				</CardHeaderActions>
				<CardTitle>
					{plannedSet.exercise.name}{" "}
					<sup className="text-sm text-base-content/60">
						{plannedSet.exercise.category}
					</sup>
				</CardTitle>
				<CardDescription>
					{plannedSet.intendedSets} x {plannedSet.intendedReps} @{" "}
					{plannedSet.targetWeight} lbs
					{plannedSet.exercise.equipmentType === "barbell" && (
						<>
							<div className="mt-1 text-xs text-base-content/60">
								Plates Needed:
							</div>
							{platesNeeded}
						</>
					)}
				</CardDescription>
			</CardHeader>
			<CardContent>
				{showWarmup &&
					plannedSet.targetWeight &&
					plannedSet.targetWeight > 0 && (
						<WarmUpSets
							plates={equipment.plates}
							barbells={equipment.barbells}
							exercise={plannedSet.exercise}
							targetWeight={plannedSet.targetWeight}
							equipmentType={plannedSet.exercise.equipmentType}
						/>
					)}

				{plannedSet.actualSets.length > 0 && <h1>Completed Sets</h1>}

				{plannedSet.actualSets.map((actualSet) => (
					<div
						key={actualSet.id}
						className="flex gap-2 items-center justify-between py-2"
					>
						{showEditActualSetForm === actualSet.id ? (
							<ActualSetForm
								plannedSet={plannedSet}
								actualSetId={showEditActualSetForm}
								cancel={() => setShowEditActualSetForm(0)}
								deleteActualSet={deleteActualSet}
							/>
						) : (
							<Card
								className="cursor-pointer w-full p-2"
								onClick={() => setShowEditActualSetForm(actualSet.id)}
							>
								<CardDescription className="flex items-center justify-between">
									{actualSet.actualReps} @ {actualSet.actualWeight} lbs{" "}
									<ChevronRight className="h-5 w-5 text-base-content/20 group-hover:text-primary transition-colors" />
								</CardDescription>
							</Card>
						)}
					</div>
				))}

				{showActualSetForm && (
					<ActualSetForm
						plannedSet={plannedSet}
						cancel={() => setShowActualSetForm(false)}
						deleteActualSet={deleteActualSet}
					/>
				)}
			</CardContent>
			{!showActualSetForm && showEditActualSetForm === 0 ? (
				<CardFooter className="justify-between gap-2">
					<div className="flex gap-2">
						<Button size="sm" onClick={() => setShowActualSetForm(true)}>
							Log Set
						</Button>
						{plannedSet.actualSets.length === 0 && (
							<Button size="sm" onClick={logAllSets}>
								Log All ({plannedSet.intendedSets})
							</Button>
						)}
					</div>
					<div>
						<Button onClick={deletePlannedSet} size="sm" variant="danger">
							<Trash className="h-4 w-4" />
						</Button>
					</div>
				</CardFooter>
			) : null}
		</Card>
	);
};
