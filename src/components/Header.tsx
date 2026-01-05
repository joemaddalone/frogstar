"use client";
import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface HeaderProps {
	title?: string;
	label?: string;
	backPath?: string;
	children?: React.ReactNode;
}

export const Header = ({ title, label, backPath, children }: HeaderProps) => {
	const pathname = usePathname();
	const router = useRouter();

	const isHome = pathname === "/";
	const displayTitle = title || label || "Frogstar";

	return (
		<header className="top-nav">
			<nav className="flex items-center justify-between px-4 h-[58px]">
				<div className="flex items-center gap-3">
					{backPath ? (
						<Button
							variant="ghost"
							size="icon"
							onClick={() => router.push(backPath as any)}
							className="-ml-2 h-9 w-9"
						>
							<ChevronLeft className="h-5 w-5" />
						</Button>
					) : !isHome && (
						<Button
							variant="ghost"
							size="icon"
							onClick={() => router.push("/")}
							className="-ml-2 h-9 w-9"
						>
							<ChevronLeft className="h-5 w-5" />
						</Button>
					)}
					<h1 className="text-lg font-bold tracking-tight">
						{displayTitle}
					</h1>
				</div>
				<div className="flex items-center gap-2">
					{children}
				</div>
			</nav>
		</header>
	);
};
