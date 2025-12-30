export const dynamic = "force-dynamic";
import { Header } from "@/components/Header";
import Link from "next/link";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";
import { SessionList } from './_components/SessionList';
import { ApiResponse, SessionWithDetails } from "@/lib/types";
export default async function HomePage() {
	const sessions = api.sessions.list();


	return (
		<div className="min-h-screen">
			<Header label="frogstar">
				<Link
					href="/session"
					className="btn btn-primary btn-xs flex items-center space-x-1 self-end"
				>
					<Plus className="h-4 w-4" />
				</Link>
			</Header>
			<SessionList sessionsLoader={sessions as Promise<ApiResponse<SessionWithDetails[]>>} />
		</div>
	);
}
