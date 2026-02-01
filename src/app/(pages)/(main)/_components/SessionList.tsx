"use client";
import type { ApiResponse, SessionWithDetails, InsertableSession, Barbell, Plate, Exercise } from "@/lib/types";
import { use, useMemo } from "react";
import { Calendar, Plus, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { SessionCard } from "./SessionCard";
import { useTranslations } from "next-intl";

export const SessionList = ({ sessionsLoader, dataLoader }: { sessionsLoader: Promise<ApiResponse<SessionWithDetails[]>>; dataLoader: Promise<[{ data: Barbell[]; }, { data: Plate[]; }, { data: Exercise[]; }]>; }) => {
	const { data: sessions, error } = use(sessionsLoader);
	const existing = use(dataLoader);
	const router = useRouter();
	const t = useTranslations();

	const hasData = existing?.[0]?.data?.length || existing?.[1]?.data?.length || existing?.[2]?.data?.length;
	const sortedSessions = useMemo(() => {
		if (!sessions) return [];
		return [...sessions].sort((a, b) => String(b.date).localeCompare(String(a.date)));
	}, [sessions]);

	if (!sessions) {
		return <div className="flex items-center justify-center min-h-[50vh]">{t("common.loading")}</div>;
	}
	if (error) {
		return <div className="p-4 text-error">{t('common.error')}: {error.message}</div>;
	}

	const STATUS_ENUM = {
		completed: t("common.completed"),
		partial: t("common.partial"),
		planned: t("common.planned")
	};

	const status = (session: SessionWithDetails) => {
		if (session.planned_sets > 0 && session.completed_sets >= session.planned_sets) {
			return STATUS_ENUM.completed;
		}
		if (session.planned_sets > 0 && session.completed_sets !== 0 && session.completed_sets < session.planned_sets) {
			return STATUS_ENUM.partial;
		}
		return STATUS_ENUM.planned;
	};

	const createSession = async () => {
		const newSession: InsertableSession = {
			date: new Date(),
		};
		const { data, error } = await api.sessions.create(newSession);
		if (error) {
			return;
		}
		if (!data?.id) {
			return;
		}
		router.push(`/session/${data.id}`);
	};

	const seedData = async () => {
		await api.data.seed();
		router.refresh();
	};



	const stats = {
		total: sessions.length,
		completed: sessions.filter((session) => status(session) === STATUS_ENUM.completed).length,
		partial: sessions.filter((session) => status(session) === STATUS_ENUM.partial).length,
		planned: sessions.filter((session) => status(session) === STATUS_ENUM.planned).length
	};

	return (
		<>
			<div className="grid grid-cols-2 gap-4">
				<Card className="cursor-pointer text-center">
					<CardHeader className="p-4">
						<div className="text-3xl font-bold text-primary">
							{stats.total}
						</div>
						<div className="text-xs font-medium text-base-content/60 uppercase tracking-wider">{t("common.total_sessions")}</div>
					</CardHeader>
				</Card>
				<Card className="text-center">
					<CardHeader className="p-4">
						<div className="text-3xl font-bold text-success">
							{stats.completed}
						</div>
						<div className="text-xs font-medium text-base-content/60 uppercase tracking-wider">{STATUS_ENUM.completed}</div>
					</CardHeader>
				</Card>
			</div>

			{hasData ? (
				<div className="flex items-center justify-center gap-2">
					<div className="badge badge-sm">Barbells: {existing?.[0]?.data?.length}</div>
					<div className="badge badge-sm">Plates: {existing?.[1]?.data?.length}</div>
					<div className="badge badge-sm">Exercises: {existing?.[2]?.data?.length}</div>
				</div>
			) : null}

			{!hasData ? (
				<Card className="text-center py-12">
					<CardContent className="flex flex-col items-center">
						<div className="bg-base-200 p-4 rounded-full mb-4">
							<Download className="h-10 w-10 text-base-content/40" />
						</div>
						<CardTitle className="mb-2">Equipment and Exercises</CardTitle>
						<p className="text-base-content/60 mb-6 max-w-[300px]">
							Let's start by adding some common equipment and exercises.
						</p>
						<Button onClick={() => seedData()}>
							<Plus className="mr-1" />Setup
						</Button>
					</CardContent>
				</Card>

			) : (
				<section>
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl font-bold tracking-tight">{t("common.recent_sessions")}</h2>
						{sessions.length > 0 && (
							<Button variant="ghost" size="sm" onClick={createSession}>
								<Plus className="mr-1" /> {t("common.new")}
							</Button>
						)}
					</div>

					{sessions.length === 0 ? (
						<Card className="text-center py-12">
							<CardContent className="flex flex-col items-center">
								<div className="bg-base-200 p-4 rounded-full mb-4">
									<Calendar className="h-10 w-10 text-base-content/40" />
								</div>
								<CardTitle className="mb-2">{t("common.no_sessions_yet")}</CardTitle>
								<p className="text-base-content/60 mb-6 max-w-[240px]">
									{t("common.start_tracking")}
								</p>
								<Button onClick={createSession}>
									<Plus className="mr-1" />{t("common.new")}
								</Button>
							</CardContent>
						</Card>
					) : (
						<div className="space-y-3">
							{sortedSessions.slice(0, 10).map((session) => (
								<SessionCard
									status={status}
									STATUS_ENUM={STATUS_ENUM}
									key={session.id}
									session={session}
								/>
							))}
						</div>
					)}
				</section>
			)}


		</>
	);
};