import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ChevronRight } from "lucide-react";
import type { SessionWithDetails } from "@/lib/types";
import { dateString } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export const SessionCard = ({
	session,
	status,
	STATUS_ENUM,
}: {
	session: SessionWithDetails;
	status: (session: SessionWithDetails) => string;
	STATUS_ENUM: { completed: string; partial: string; planned: string; };
}) => {
	const router = useRouter();
	const t = useTranslations();

	return (
		<Card
			className="group cursor-pointer hover:border-primary/50 transition-all hover:shadow-md"
			onClick={() => router.push(`/session/${session.id}`)}
		>
			<CardContent className="p-4 flex items-center justify-between">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<span className="font-semibold text-lg">
							{dateString(session.date)}
						</span>
						<Badge
							variant={
								status(session) === STATUS_ENUM.completed
									? "success"
									: status(session) === STATUS_ENUM.partial
										? "warning"
										: "outline"
							}
						>
							{status(session)}
						</Badge>
					</div>
					<p className="text-sm text-base-content/60">
						{session.planned_exercises} {t("common.exercises")} •{" "}
						{session.completed_sets}/{session.planned_sets} {t("common.sets")}
					</p>
					{session.notes && (
						<p className="text-xs text-base-content/40 italic line-clamp-1">
							{session.notes}
						</p>
					)}
				</div>
				<ChevronRight className="h-5 w-5 text-base-content/20 group-hover:text-primary transition-colors" />
			</CardContent>
		</Card>
	);
};
