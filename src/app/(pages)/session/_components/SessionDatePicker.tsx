"use client";
import { api } from "@/lib/api";
import { Session } from "@/lib/types";
import { DayPicker } from "react-day-picker";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";
export const SessionDatePicker = ({ session }: { session: Session; }) => {
	const router = useRouter();
	const updateSessionDate = async (date: Date) => {
		const { error } = await api.sessions.update({
			...session,
			date,
		});
		if (error) {
			console.error(error);
		}
		router.refresh();
	};

	return (
		<>
			<button
				popoverTarget="rdp-popover"
				className="btn btn-xs p-4"
				style={{ anchorName: "--rdp" } as React.CSSProperties}
			>
				<CalendarIcon className="h-4 w-4" />{" "}
				{session.date
					? new Date(session.date).toLocaleDateString()
					: "Pick a date"}
			</button>
			<div
				popover="auto"
				id="rdp-popover"
				className="dropdown dropdown-center"
				style={{ positionAnchor: "--rdp" } as React.CSSProperties}
			>
				<DayPicker
					required
					className="react-day-picker"
					mode="single"
					selected={session.date}
					defaultMonth={session.date}
					onSelect={(e) => updateSessionDate(new Date(e))}
				/>
			</div>
		</>
	);
};
