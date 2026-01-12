"use client";
import { ThemeProvider } from "./ThemeProvider";
import { ToastProvider } from "./ToastContext";
// import { useEffect } from "react";
export const Providers = ({ children }: { children: React.ReactNode; }) => {
	// useEffect(() => {
	// 	window.scrollTo(0, 0);
	// }, []);
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
			<ToastProvider>
				{children}
			</ToastProvider>
		</ThemeProvider>
	);
};