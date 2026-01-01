"use client";
import { Session } from "@/lib/types";
import { Button } from "@/components/ui/Button";
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
			<Button onClick={deleteSession} size="xs" variant="danger"><Trash className="h-4 w-4" /></Button>
		</div>
	);
};