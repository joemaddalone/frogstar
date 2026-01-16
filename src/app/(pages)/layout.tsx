import type { Metadata } from "next";
import { Providers } from "@/components/context/Providers";
import { getMessages, getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { BottomNav } from "@/components/BottomNav";
import { DesktopNav } from "@/components/DesktopNav";
import "@/styles/globals.css";

export const metadata: Metadata = {
	title: "frogstar",
	description: "description of this app",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {


	const messages = await getMessages();
	const locale = await getLocale();


	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
				/>
			</head>
			<body>
				<NextIntlClientProvider messages={messages} locale={locale}>
					<Providers>
						<div className="w-full min-h-screen bg-base-100">
							<DesktopNav />
							<div className="w-full lg:pl-0 pb-24 lg:pb-0">
								{children}
							</div>
							<div className="lg:hidden">
								<BottomNav />
							</div>
						</div>
					</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
