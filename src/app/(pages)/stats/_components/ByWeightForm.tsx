"use client";
import { api } from "@/lib/api";
import type { Exercise, ApiResponse } from "@/lib/types";
import { use, useEffect, useState } from "react";
import { Select } from "@/components/ui/Select";
import { BarChart } from "@/components/viz/BarChart";
import { useTranslations } from "next-intl";
import { Calendar, Weight } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";


type ProgressEntry = {
	sessionId: number;
	date: string | number;
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
	const [exercise, setExercise] = useState(data ? filteredExercises?.[0]?.id : undefined);
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

	if (data.length === 0) {
		return <div>{t("common.no_data")}</div>;
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
				{progress.length === 0 ? (
					<h1 className="text-xl font-bold tracking-tight">{t("common.not_found")}</h1>
				) : (
					<>
						{progress.length < 100 && progress.length > 2 ? (
							<div className="flex justify-center items-center outline outline-base-300 p-1 rounded">
								<BarChart data={progress as ProgressEntry[]} />
							</div>
						) : null}
						<ul className=" mt-4">
							<li className="flex justify-between border-b border-base-300 p-1">
								<span className="font-mono text-sm"><Calendar className="w-4 h-4" /></span>
								<span className="font-mono text-sm"><Weight className="w-4 h-4" /></span>
							</li>
							{progress.map((p) => (
								<li key={`${p.sessionId}-${p.date}-${p.max_weight}`} className=" ">
									<Link href={`/session/${p.sessionId}` as Route} className="flex justify-between hover:bg-base-200 py-2 border-b border-base-300">
										<span className="font-mono text-sm">
											{new Date(p.date).toLocaleDateString()}
										</span>
										<span className="font-mono text-sm">{p.max_weight}</span>
									</Link>
								</li>
							))}
						</ul>
					</>
				)}
			</div>
		</div>
	);
};
