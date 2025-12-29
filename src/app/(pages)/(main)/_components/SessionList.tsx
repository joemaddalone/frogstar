"use client";
import { ApiResponse, SessionWithDetails } from "@/lib/types";
import { use } from "react";
import Link from "next/link";
import { dateString } from "@/lib/utils";

export const SessionList = ({ sessions }: { sessions: Promise<ApiResponse<SessionWithDetails[]>>; }) => {
	const { data, error } = use(sessions);
	data?.sort((a: SessionWithDetails, b: SessionWithDetails) => String(b.date).localeCompare(String(a.date)));
	return (
		<div>
			<h2>Session List</h2>
			<ul>
				{data?.map((session: SessionWithDetails) => (
					<li key={session.id}>
						<Link href={`/session/${session.id}`}>{dateString(session.date)}</Link>
					</li>
				))}
			</ul>
		</div>
	);
};