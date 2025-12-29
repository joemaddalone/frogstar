export const dynamic = "force-dynamic";
import { Header } from "@/components/Header";
import Link from "next/link";
import { Plus } from "lucide-react";
import { SessionForm } from "@/app/(pages)/session/_components/SessionForm";
export default async function SessionPage() {

	return (
		<div className="min-h-screen">
			<Header label="session">
				<Link
					href="/session"
					className="btn-primary flex items-center space-x-1 self-end"
				>
					<Plus className="h-4 w-4" />
				</Link>
			</Header>
			<SessionForm />
		</div>
	);
}
