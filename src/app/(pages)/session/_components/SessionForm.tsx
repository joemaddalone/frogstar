"use client";

import type { InsertableSession } from "@/lib/types";
import { useApi } from "@/app/hooks/useApi";
import { useRouter } from "next/navigation";
import { DayPicker } from "react-day-picker";
import { useState } from "react";

export const SessionForm = () => {
	const [sessionDate, setSessionDate] = useState<Date>(new Date());
	const api = useApi();
	const router = useRouter();

	const createSession = async () => {
		const newSession: InsertableSession = {
			date: sessionDate,
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

	return (
		<div className="join">
			<div>
				<button type="button" popoverTarget="rdp-popover" className="input input-border" style={{ anchorName: "--rdp" } as React.CSSProperties}>
					{sessionDate ? sessionDate.toLocaleDateString() : "Pick a date"}
				</button>
				<div popover="auto" id="rdp-popover" className="dropdown" style={{ positionAnchor: "--rdp" } as React.CSSProperties}>
					<DayPicker required className="react-day-picker" mode="single" selected={sessionDate} onSelect={setSessionDate} />
				</div>
			</div>
			<button type="button" onClick={createSession} className="btn btn-primary join-item">Create Session</button>
		</div>
	);
}


