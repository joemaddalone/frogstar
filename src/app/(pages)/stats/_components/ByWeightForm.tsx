"use client";
import { api } from "@/lib/api";
import type { Exercise, ApiResponse } from "@/lib/types";
import { use, useEffect, useState } from "react";
import { Select } from "@/components/ui/Select";
import { useTranslations } from "next-intl";
type ProgressEntry = {
	date: Date | string | number;
	max_weight: number;
};

export const ByWeightForm = ({
	exercises,
}: {
	exercises: Promise<ApiResponse<Exercise[]>>;
}) => {
	const t = useTranslations();
	const { data, error } = use(exercises);
	const filteredExercises = data?.filter(
		(exercise: Exercise) => exercise.equipmentType !== "bodyweight",
	) || [];

	const [range, setRange] = useState("30");
	const [exercise, setExercise] = useState(filteredExercises?.[0].id);
	const [progress, setProgress] = useState<ProgressEntry[]>([]);

	useEffect(() => {
		const fetchProgress = async () => {
			const { data, error } = await api.progress.progressByWeight(Number(range), exercise);
			if (error || !data) {
				return;
			}
			setProgress(Array.isArray(data) ? data : [data]);
		};
		fetchProgress();
	}, [range, exercise]);

	if (error) {
		return <div>{t("common.error")}: {error.message}</div>;
	}
	if (!data) {
		return <div>{t("common.loading")}</div>;
	}

	return (
		<div>
			<h1 className="text-xl font-bold tracking-tight">{t("common.progress_by_weight")}</h1>
			<form>
				<Select name="range" label="Range" defaultValue="30" onChange={(e) => setRange(e.target.value)}>
					<option value="30">{t("common.last_30_days")}</option>
					<option value="90">{t("common.last_90_days")}</option>
					<option value="180">{t("common.last_180_days")}</option>
					<option value="365">{t("common.last_365_days")}</option>
					<option value="0">{t("common.all_time")}</option>
				</Select>
				<Select
					name="exercise"
					label="Exercise"
					defaultValue={filteredExercises[0].id}
					onChange={(e) => setExercise(Number(e.target.value))}
				>
					{filteredExercises.map((exercise: Exercise) => (
						<option key={exercise.id} value={exercise.id}>
							{exercise.name}
						</option>
					))}
				</Select>
			</form>
			<div className="mt-4">
				<ul className="space-y-2">
					{progress.length === 0 ? (
						<li>{t("common.not_found")}</li>
					) : (
						progress.map((p) => (
							<li key={`${p.date}-${p.max_weight}`} className="flex justify-between border-b border-base-300 pb-1">
								<span className="font-mono text-sm">{new Date(p.date).toLocaleDateString()}</span>
								<span className="font-mono text-sm">{p.max_weight}</span>
							</li>
						))
					)}
				</ul>
			</div>
		</div>
	);
};
