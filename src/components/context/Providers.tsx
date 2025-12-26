"use client";
import { ThemeProvider } from "./ThemeProvider";
import { useEffect } from "react";
export const Providers = ({ children }: { children: React.ReactNode; }) => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
			{children}
		</ThemeProvider>
	);
};