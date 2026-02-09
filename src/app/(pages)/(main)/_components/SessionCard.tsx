import { Card, CardContent } from "@/components/ui/Card";
import { ChevronRight } from "lucide-react";
import type { SessionWithDetails } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export const SessionCard = ({ session }: { session: SessionWithDetails; }) => {
	const router = useRouter();
	const t = useTranslations();

	const date = new Date(session.date);
	const day = date.getDate();
	const month = date.toLocaleString("default", { month: "short" });

	return (
		<Card
			className="group cursor-pointer hover:border-primary/50 transition-all hover:shadow-md"
			onClick={() => router.push(`/session/${session.id}`)}
		>
			<CardContent className="p-4 flex items-center space-x-4">
				<div className="flex items-center justify-between w-full">
					<div className="flex items-center gap-4">
						<div className="session-date flex flex-col items-center border-r border-base-content/10 pr-4">
							<span className="session-date-day text-2xl font-bold">{day}</span>
							<span className="session-date-month text-xs text-center uppercase text-base-content/60">
								{month}
							</span>
						</div>
						<div className="space-y-1">
							<p className="text-sm text-base-content/60">
								<span className="font-bold mr-1">Planned:</span>
								{session.planned_sets} {t("common.sets")} •{" "}
								{session.planned_reps} {t("common.reps")} •{" "}
								{session.planned_exercises} {t("common.exercises")}
							</p>
							{session.completed_reps > 0 && (
								<p className="text-sm text-base-content/60">
									<span className="font-bold mr-1">Completed:</span>
									{session.completed_sets} {t("common.sets")} •{" "}
									{session.completed_reps} {t("common.reps")}
								</p>
							)}
							{session.notes && (
								<p className="text-xs text-base-content/40 italic line-clamp-1">
									{session.notes}
								</p>
							)}
						</div>
					</div>
					<ChevronRight className="h-5 w-5 text-base-content/20 group-hover:text-primary transition-colors" />
				</div>
			</CardContent>
		</Card>
	);
};
