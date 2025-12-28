export const dynamic = "force-dynamic";
import { Header } from "@/components/Header";
import { SettingsNav } from "./_components/SettingsNav";

export default async function SettingsLayout({ children }: { children: React.ReactNode; }) {
	return (
		<div className="min-h-screen">
			<Header label="settings" />
			<SettingsNav />
			{children}
		</div>
	);
}
