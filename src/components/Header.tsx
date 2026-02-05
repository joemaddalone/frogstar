"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Route } from "next";

interface HeaderProps {
	title?: string;
	label?: string;
	children?: React.ReactNode;
	backLink?: string;
}

export const Header = ({ title, label, children, backLink }: HeaderProps) => {
	const displayTitle = title || label || "Frogstar";
	return (
		<header className="top-nav">
			<nav className="flex items-center justify-between px-4 h-[64px]">
				<div className="flex items-center gap-2">
					{backLink ? (
						<Link href={backLink as Route}>
						<h1 className="flex items-center text-xl font-extrabold tracking-tight capitalize">

							<ChevronLeft className="h-5 w-5" /> {displayTitle}
							</h1>
						</Link>
					) : (
						<h1 className="text-xl font-extrabold tracking-tight capitalize">
						{displayTitle}
					</h1>
					)}

				</div>
				<div className="flex items-center gap-2">
					{children}
				</div>
			</nav>
		</header>
	);
};
