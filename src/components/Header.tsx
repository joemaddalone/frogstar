"use client";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Route } from "next";

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
			<nav className="flex items-center justify-between px-4 h-[64px]">
				<div className="flex items-center gap-2">
					{backPath ? (
						<Button
							variant="ghost"
							size="icon"
							onClick={() => router.push(backPath as Route)}
							className="-ml-2 h-11 w-11 rounded-full active:bg-base-200"
						>
							<ChevronLeft className="h-6 w-6" />
						</Button>
					) : !isHome && (
						<Button
							variant="ghost"
							size="icon"
							onClick={() => router.push("/")}
							className="-ml-2 h-11 w-11 rounded-full active:bg-base-200"
						>
							<ChevronLeft className="h-6 w-6" />
						</Button>
					)}
					<h1 className="text-xl font-extrabold tracking-tight">
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
