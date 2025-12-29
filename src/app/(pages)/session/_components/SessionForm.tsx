"use client";

import { useActionState } from "react";
import { InsertableSession } from "@/lib/types";
import { useApi } from "@/app/hooks/useApi";
import { useRouter } from "next/navigation";

export const SessionForm = () => {

	const api = useApi();

	const createSession = api.sessions.create;

	const router = useRouter();

	const action = async (state: any, formData: FormData) => {
		const newSession: InsertableSession = {
			date: new Date(formData.get("date") as string),
		};
		const { data, error } = await createSession(newSession);
		if (error) {
			return state;
		}
		if (!data?.id) {
			return state;
		}
		router.push(`/session/${data.id}`);
		return state;
	};

	const [sessionData, formAction, pending] = useActionState(action, null);

	return (
		<form action={formAction}>
			<input type="date" name="date" className="text-black" />
			<button type="submit" disabled={pending}>Create</button>
		</form>
	);
}


