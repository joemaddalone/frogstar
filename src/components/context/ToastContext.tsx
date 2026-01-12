"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { Toast } from "@/components/ui/Toast";

type ToastType = "info" | "success" | "error";

interface ToastState {
	message: string;
	type: ToastType;
}

interface ToastContextType {
	showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode; }) => {
	const [toast, setToast] = useState<ToastState | null>(null);

	const showToast = useCallback((type: ToastType, message: string) => {
		setToast({ type, message });
		setTimeout(() => {
			setToast(null);
		}, 2000);
	}, []);

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			{toast && <Toast message={toast.message} type={toast.type} />}
		</ToastContext.Provider>
	);
};

export const useToastContext = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToastContext must be used within a ToastProvider");
	}
	return context;
};
