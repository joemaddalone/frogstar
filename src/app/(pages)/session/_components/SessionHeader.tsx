"use client";
import type { Session } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Copy, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useTranslations } from "next-intl";
export const SessionHeader = ({ session }: { session: Session; }) => {
	const router = useRouter();
	const t = useTranslations();
	const deleteSession = async () => {
		if (window.confirm(t("common.confirm_delete_session"))) {
			const { error } = await api.sessions.delete(session.id);
			if (!error) {
				router.push("/");
			}
		}
	};

	const copySession = async () => {
		const { data, error } = await api.sessions.copy(session.id);
		if (!error) {
			router.push(`/session/${data.id}`);
		}
	};

	return (
		<div className="flex items-center space-x-2">
			<Button onClick={copySession} size="xs" variant="outline">Copy <Copy className="h-4 w-4" /></Button>
			<Button onClick={deleteSession} size="xs" variant="danger">Delete <Trash className="h-4 w-4" /></Button>
		</div>
	);
};