import type { Metadata } from "next";
import { Providers } from "@/components/context/Providers";
import { getMessages, getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { BottomNav } from "@/components/BottomNav";
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
		<html lang="en" suppressHydrationWarning data-theme="bumblebee">
			<head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
				/>
			</head>
			<body>
				<NextIntlClientProvider messages={messages} locale={locale}>
					<Providers>
						<div className="w-full">
							{children}
							<BottomNav />
						</div>
					</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
