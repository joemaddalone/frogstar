export const dynamic = "force-dynamic";
import { getTranslations } from "next-intl/server";
export default async function SettingsPage() {
	const t = await getTranslations();
	return (
		<>
			<h1 className="text-2xl font-bold text-center mt-4">{t("common.preferences")}</h1>
			<p className="text-center">...</p>
		</>
	);
}
