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
import { WarmUpSets } from "./WarmupSets";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardHeaderActions,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ChevronRight, Pencil } from "lucide-react";
import { PlateViz } from "@/components/PlateViz";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useTranslations } from "next-intl";
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
	const t = useTranslations();

	const deleteActualSet = async (actualSetId: number) => {
		const { error } = await api.actual_sets.delete(actualSetId);
		if (!error) {
			setShowEditActualSetForm(0);
			setShowActualSetForm(false);
			router.refresh();
		}
	};

	const logSet = async () => {
		const { error } = await api.actual_sets.create({
			plannedSetId: plannedSet.id,
			actualReps: plannedSet.intendedReps,
			actualWeight: plannedSet.targetWeight,
		});
		if (!error) {
			router.refresh();
		}
	};

	const isBodyweight = plannedSet.exercise.equipmentType === "bodyweight";

	// const logAllSets = async () => {
	// 	for (let i = 0; i < plannedSet.intendedSets; i++) {
	// 		await logSet();
	// 	}
	// 	router.refresh();
	// };

	const barWeight =
		equipment.barbells.find(
			(barbell) => barbell.id === plannedSet.exercise.barbellId,
		)?.weight || 0;

	return (
		<Card>
			<CardHeader>
				<CardHeaderActions>
					<ButtonLink
						size="sm"
						variant="outline"
						href={`/session/${plannedSet.sessionId}/ps/${plannedSet.id}`}
					>
						<Pencil className="h-4 w-4" />
					</ButtonLink>
				</CardHeaderActions>
				<CardTitle>
					{plannedSet.exercise.name}{" "}
					<sup className="text-sm text-base-content/60">
						{plannedSet.exercise.category}
					</sup>
				</CardTitle>
				<CardDescription>
					<span>{plannedSet.intendedSets} x {plannedSet.intendedReps}</span> <span>{!isBodyweight && `@ ${plannedSet.targetWeight}`}</span>
					{plannedSet.exercise.equipmentType === "barbell" && (
						<PlateViz
							plates={equipment.plates}
							bar={barWeight}
							target={plannedSet.targetWeight || 0}
						/>
					)}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex justify-between gap-2">
					<Button size="sm" className="w-auto mb-2" onClick={logSet}>
						{t("common.log_set")}
					</Button>
					{plannedSet.exercise.equipmentType === "barbell" && (
						<Button
							onClick={() => setShowWarmup(!showWarmup)}
							size="sm"
							variant="outline"
						>
							{showWarmup ? t("common.hide") : t("common.show")}{" "}
							{t("common.warmups")}
						</Button>
					)}
				</div>

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

				{plannedSet.actualSets.length > 0 && (
					<h1>{t("common.completed_sets")}</h1>
				)}
				{plannedSet.actualSets.map((actualSet) => {
					return (
						<div
							key={actualSet.id}
							className="flex gap-2 items-center justify-between py-1"
						>
							{showEditActualSetForm === actualSet.id ? (
								<ActualSetForm
									showWeight={!isBodyweight}
									plannedSet={plannedSet}
									actualSetId={showEditActualSetForm}
									cancel={() => setShowEditActualSetForm(0)}
									deleteActualSet={deleteActualSet}
								/>
							) : (
								<Card
									className={`cursor-pointer p-2 w-full`}
									onClick={() => setShowEditActualSetForm(actualSet.id)}
								>
									<CardDescription className="flex items-center justify-between">
										<div>
											<span>{actualSet.actualReps}</span> <span>{!isBodyweight && `@ ${actualSet.actualWeight}`}</span>
										</div>
										<ChevronRight className="h-5 w-5 text-base-content/20 group-hover:text-primary transition-colors" />
									</CardDescription>
								</Card>
							)}
						</div>
					);
				})}

				{showActualSetForm && (
					<ActualSetForm
						showWeight={!isBodyweight}
						plannedSet={plannedSet}
						cancel={() => setShowActualSetForm(false)}
						deleteActualSet={deleteActualSet}
					/>
				)}
			</CardContent>
		</Card>
	);
};
