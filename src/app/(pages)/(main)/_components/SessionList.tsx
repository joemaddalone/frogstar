"use client";
import { ApiResponse, SessionWithDetails } from "@/lib/types";
import { use } from "react";
import Link from "next/link";
import { dateString } from "@/lib/utils";
import { Calendar, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export const SessionList = ({ sessionsLoader }: { sessionsLoader: Promise<ApiResponse<SessionWithDetails[]>>; }) => {
	const { data: sessions, error } = use(sessionsLoader);
	const router = useRouter();
	sessions?.sort((a: SessionWithDetails, b: SessionWithDetails) => String(b.date).localeCompare(String(a.date)));
	if (!sessions) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div>Error: {error.message}</div>;
	}

	const isCompleted = (session: SessionWithDetails) => {
		return session.planned_sets > 0 && session.completed_sets >= session.planned_sets;
	};

	return (
		<main className="p-4">
			<div className="grid grid-cols-2 gap-4 mb-6">
				<div className="card card-border text-center p-4">
					<div className="text-2xl font-bold text-primary-600">
						{sessions.length}
					</div>
					<div className="text-sm text-gray-600">Total Sessions</div>
				</div>
				<div className="card card-border text-center p-4">
					<div className="text-2xl font-bold text-green-600">
						{sessions.filter(s => isCompleted(s)).length}
					</div>
					<div className="text-sm text-gray-600">Completed</div>
				</div>
			</div>

			<div className="mb-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-3">Sessions</h2>
				{sessions.length === 0 ? (
					<div className="card card-border text-center py-8">
						<Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
						<p className="text-gray-600 mb-4">No sessions yet</p>
						<Link
							href="/session"
							className="btn btn-primary flex items-center space-x-1 mx-auto"
						>
							<Plus className="h-4 w-4" /> Create your first Session
						</Link>
					</div>
				) : (
					<div className="card space-y-3">
						{sessions.slice(0, 10).map((session) => (
							<div
								key={session.id}
								className="card card-border bg-base-100 cursor-pointer text-left p-4"
								onClick={() => router.push(`/session/${session.id}`)}
							>
								<div className="flex items-center justify-between">
									<div>
										<div className="card-title">
											{dateString(session.date)}
										</div>
										<div className="text-sm text-gray-600">
											{session.planned_exercises} exercises • {session.completed_sets} of {session.planned_sets} sets completed
										</div>
										{session.notes && (
											<div className="text-sm text-gray-500 mt-1">{session.notes}</div>
										)}
									</div>
									<div className="card-actions justify-end">
										<div className={`text-sm font-medium ${isCompleted(session) ? 'text-green-600' : 'text-gray-400'
											}`}>
											{isCompleted(session) ? 'Completed' : 'Planned'}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</main>
	);
};