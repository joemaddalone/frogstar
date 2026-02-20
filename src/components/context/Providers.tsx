"use client";
import { ThemeProvider } from "./ThemeProvider";
import { ToastProvider } from "./ToastContext";
import { TimerProvider } from "./TimerContext";
export const Providers = ({ children }: { children: React.ReactNode; }) => {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
			<ToastProvider>
				<TimerProvider>
					{children}
				</TimerProvider>
			</ToastProvider>
		</ThemeProvider>
	);
};