export const dynamic = "force-dynamic";
import { Header } from "@/components/Header";
import Link from "next/link";
import { Plus } from "lucide-react";
export default async function ProgressPage() {
	return (
		<div className="min-h-screen">
			<Header label="progress">
				<Link
					href="/session"
					className="btn-primary flex items-center space-x-1 self-end"
				>
					<Plus className="h-4 w-4" />
				</Link>
			</Header>
		</div>
	);
}
