"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import type { Route } from "next";

export const Header = ({ children, label, backPath }: { children?: React.ReactNode, label?: string; backPath?: Route; }) => {
	const router = useRouter();
	const pathname = usePathname();

	return (
		<header className="w-full p-2 border-b border-gray-200">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-2">
					{pathname !== "/" && !backPath && (
						<button onClick={() => router.push("/")} className="mr-3">
							<ArrowLeft className="h-5 w-5" />
						</button>
					)}
					{backPath && (
						<button type="button" onClick={() => router.push(backPath)} className="mr-3">
							<ArrowLeft className="h-5 w-5" />
						</button>
					)}
					{label && <h1>{label}</h1>}
				</div>
				{children}
			</div>
		</header>
	);
};
