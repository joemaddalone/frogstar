"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";

type ApiEndpoint = keyof typeof api;

interface SettingsApi<T, I> {
	create: (item: I) => Promise<ApiResponse<T>>;
	update: (item: T & { id: number; }) => Promise<ApiResponse<T>>;
	delete: (id: number) => Promise<ApiResponse<void>>;
}

export const useSettingsForm = <T extends { id: number; }, I, S>(
	endpoint: ApiEndpoint,
	item?: T
) => {
	const t = useTranslations();
	const router = useRouter();
	const singular = endpoint.slice(0, -1);
	const endpointApi = api[endpoint] as unknown as SettingsApi<T, I>;

	const onDelete = async (id?: number) => {
		const deleteId = id || item?.id;
		if (deleteId) {
			if (!window.confirm(t(`common.confirm_delete_${singular}`))) {
				return;
			}
			const { error } = await endpointApi.delete(deleteId);
			if (!error) {
				router.refresh();
				router.push(`/settings/${endpoint}` as Route);
			}
		}
	};

	const createAction = (mapFormData: (formData: FormData) => Partial<T> | I) => {
		return async (state: S, formData: FormData): Promise<S> => {
			const data = mapFormData(formData);
			let response: ApiResponse<T>;

			if (item?.id) {
				response = await endpointApi.update({
					...(data as T),
					id: item.id,
				});
			} else {
				response = await endpointApi.create(data as I);
			}

			if (response.error || !response.data?.id) {
				return state;
			}

			router.refresh();
			router.push(`/settings/${endpoint}` as Route);
			return state;
		};
	};

	return { onDelete, createAction };
};
