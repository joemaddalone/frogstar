"use client";
import type {
	Plate,
	Barbell,
	PlannedSet,
	ActualSet,
	Exercise,
} from "@/lib/types";
import { useState, use, useRef, useEffect } from "react";
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
import { Pencil } from "lucide-react";
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
	const modalRef = useRef<HTMLDialogElement>(null);
	const [showEditActualSetForm, setShowEditActualSetForm] = useState(0);
	const [showWarmup, setShowWarmup] = useState(false);
	const equipment = use(equipmentLoader);
	const router = useRouter();
	const t = useTranslations();

	const deleteActualSet = async (actualSetId: number) => {
		const { error } = await api.actual_sets.delete(actualSetId);
		if (!error) {
			setShowEditActualSetForm(0);
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

	useEffect(() => {
		if (showEditActualSetForm !== 0 && !modalRef.current?.open) {
			modalRef.current?.showModal();
		}
	}, [showEditActualSetForm]);

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
				<div
					className="flex gap-2 items-center py-1 flex-wrap"
				>
					{plannedSet.actualSets.map((actualSet) => {
						return (
							<button key={actualSet.id} type="button" onClick={() => setShowEditActualSetForm(actualSet.id)} className="btn">
								<span>{actualSet.actualReps}</span> <span>{!isBodyweight && `@ ${actualSet.actualWeight}`}</span>
							</button>
						);
					})}

				</div>
				{showEditActualSetForm !== 0 && (
					<dialog
						ref={modalRef}
						className="modal modal-bottom sm:modal-middle"
						onClose={() => setShowEditActualSetForm(0)}
					>
						<div className="modal-box">
							<h3 className="font-bold text-lg mb-4">Edit Completed Set</h3>
							<ActualSetForm
								showWeight={!isBodyweight}
								plannedSet={plannedSet}
								actualSetId={showEditActualSetForm}
								cancel={() => setShowEditActualSetForm(0)}
								deleteActualSet={deleteActualSet}
							/>
						</div>
					</dialog>
				)}
			</CardContent>
		</Card>
	);
};
