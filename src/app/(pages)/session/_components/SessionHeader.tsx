"use client";
import { Session } from "@/lib/types";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
export const SessionHeader = ({ session }: { session: Session; }) => {
	const router = useRouter();
	const deleteSession = async () => {
		if (window.confirm("Are you sure you want to delete this session?")) {
			const { error } = await api.sessions.delete(session.id);
			if (!error) {
				router.push("/");
			}
		}
	};
	return (
		<div className="flex items-center space-x-2">
			<Link
				href={`/session/${session.id}/add`}
				className="btn btn-xs btn-primary flex items-center space-x-1 self-end"
			>
				<Plus className="h-4 w-4" />
			</Link>
			<button
				className="btn btn-xs btn-error flex items-center space-x-1 self-end"
				onClick={deleteSession}
			>
				<Trash className="h-4 w-4" />
			</button>
		</div>
	);
};