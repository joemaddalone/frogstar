"use client";
import { dateString } from "@/lib/utils";
import { api } from "@/lib/api";
import { Session } from "@/lib/types";
export const SessionDatePicker = ({ session }: { session: Session; }) => {
	return (
		<input
			className="text-black"
			type="date"
			name="date"
			defaultValue={dateString(session.date).replaceAll("/", "-")}
			onChange={(e) =>
				api.sessions.update({
					id: session.id,
					date: new Date(e.target.value),
					notes: session.notes,
					finished: session.finished,
				})
			}
		/>
	);
};
