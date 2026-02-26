"use client";
import type { Session } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Copy, Trash, Settings } from "lucide-react";
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

		<div className="dropdown dropdown-bottom dropdown-end">
			<Button size="icon" variant="outline" tabIndex={0} role="button">
				<Settings  className="h-4 w-4" />
			</Button>
			<ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box z-999 w-52 p-2 shadow-lg">
				<li className="mb-2"><Button onClick={copySession} size="xs" variant="outline"><Copy className="h-4 w-4" />Copy</Button></li>
				<li><Button onClick={deleteSession} size="xs" variant="danger"><Trash className="h-4 w-4" />Delete</Button></li>
			</ul>
		</div >

	);
};