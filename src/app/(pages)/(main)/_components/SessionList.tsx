"use client";
import type { ApiResponse, SessionWithDetails, InsertableSession, Barbell, Plate, Exercise } from "@/lib/types";
import { use, useMemo } from "react";
import { Calendar, Plus, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
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



	return (
		<>
			{hasData ? (
				<div className="flex items-center justify-center gap-2">
					<div className="badge badge-sm p-4!">Barbells: {existing?.[0]?.data?.length}</div>
					<div className="badge badge-sm p-4!">Plates: {existing?.[1]?.data?.length}</div>
					<div className="badge badge-sm p-4!">Exercises: {existing?.[2]?.data?.length}</div>
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