import { useToastContext } from "@/components/context/ToastContext";

export const useToast = () => {
	return useToastContext();
};