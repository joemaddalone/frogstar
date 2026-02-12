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
import { AnimatePresence, motion } from "framer-motion";
import { Timer } from "@/components/Timer";

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
	const [timer, setTimer] = useState(0);
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
			setTimer(Date.now());
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
					<div className="flex items-center gap-2 text-base-content/60 text-sm">
						<div>
							<span>{plannedSet.intendedSets} x {plannedSet.intendedReps}</span> <span>{!isBodyweight && `@ ${plannedSet.targetWeight}`}</span>
						</div>
						{plannedSet.exercise.equipmentType === "barbell" && (
							<label className={`label ${showWarmup ? "text-info font-bold" : ""}`}>
								<input type="checkbox" className="toggle toggle-info toggle-xs" onChange={() => setShowWarmup(!showWarmup)} />
								<span className="text-sm">{t("common.warmups")}</span>
							</label>

						)}
					</div>
				</CardTitle>
				<CardDescription>




					<div className="flex items-center mb-2">

					</div>
					<AnimatePresence initial={false}>
						{!showWarmup && plannedSet.exercise.equipmentType === "barbell" && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
								className="border border-base-content/10 rounded-sm"
							>
								<PlateViz
									className="p-4"
									plates={equipment.plates}
									bar={barWeight}
									target={plannedSet.targetWeight || 0}
								/>
							</motion.div>
						)}
					</AnimatePresence>
				</CardDescription>
			</CardHeader>
			<CardContent>



				<AnimatePresence>
					{showWarmup &&
						plannedSet.targetWeight &&
						plannedSet.targetWeight > 0 && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto', marginBottom: 10 }}
								exit={{ opacity: 0, height: 0, marginBottom: 0 }}
							>
								<WarmUpSets
									plates={equipment.plates}
									barbells={equipment.barbells}
									exercise={plannedSet.exercise}
									targetWeight={plannedSet.targetWeight}
									equipmentType={plannedSet.exercise.equipmentType}
								/>
							</motion.div>
						)}
				</AnimatePresence>

				<div className="flex gap-2 items-center mb-4">
					<AnimatePresence initial={false}>
						{!showWarmup ? (
							<Button size="sm" className="w-auto" onClick={logSet}>
								{t("common.log_set")}
							</Button>
						) : null}

					</AnimatePresence>
					<AnimatePresence initial={false}>
						{timer !== 0 && (
							<motion.div
								key={timer}
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
							>
								<Timer destroy={() => setTimer(0)} />
							</motion.div>
						)}
					</AnimatePresence>
				</div>


				<AnimatePresence initial={false}>
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
					>

						{!showWarmup && (
							<>


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
							</>)}
					</motion.div>
				</AnimatePresence>
				{showEditActualSetForm !== 0 && (
					<dialog
						ref={modalRef}
						className="modal modal-top sm:modal-middle"
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
						<form method="dialog" className="modal-backdrop bg-base-content/60 backdrop-blur-sm">
							<button type="submit">close</button>
						</form>
					</dialog>
				)}
			</CardContent>
		</Card>
	);
};
