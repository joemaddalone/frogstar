"use client";
import { Calendar, BarChart3, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export const BottomNav = () => {
	const pathname = usePathname();

	return (
		<nav className="bottom-nav">
			<div className="flex justify-around py-2">
				<Link
					href="/"
					className={pathname === "/" ? "bottom-nav-item active" : "bottom-nav-item"}
				>
					<Calendar className="h-5 w-5" />
					<span className="text-xs mt-1">Sessions</span>
				</Link>
				<Link
					href="/progress"
					className={pathname === "/progress" ? "bottom-nav-item active" : "bottom-nav-item"}
				>
					<BarChart3 className="h-5 w-5" />
					<span className="text-xs mt-1">Progress</span>
				</Link>
				<Link
					href="/settings"
					className={pathname.includes("/settings") ? "bottom-nav-item active" : "bottom-nav-item"}
				>
					<Settings className="h-5 w-5" />
					<span className="text-xs mt-1">Settings</span>
				</Link>
			</div>
		</nav>
	);
};
