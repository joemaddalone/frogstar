"use client";
import { api } from "@/lib/api";
import type { Session } from "@/lib/types";
import { DayPicker } from "react-day-picker";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
export const SessionDatePicker = ({ session }: { session: Session; }) => {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const updateSessionDate = async (date: Date) => {
		const { error } = await api.sessions.update({
			...session,
			date,
		});
		if (error) {
			console.error(error);
		}
		router.refresh();
		// close popover
		setTimeout(() => {
			setIsOpen(false);
		}, 500);
	};

	return (
		<>
			<button
				type="button"
				popoverTarget="rdp-popover"
				className="btn btn-lg p-4"
				style={{ anchorName: "--rdp" } as React.CSSProperties}
				onClick={() => setIsOpen(!isOpen)}
			>
				<CalendarIcon className="h-4 w-4" />{" "}
				{session.date
					? new Date(session.date).toLocaleDateString()
					: "Pick a date"}
			</button>
			{isOpen && (
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
			)}
		</>
	);
};
