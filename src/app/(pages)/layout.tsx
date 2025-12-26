import type { Metadata } from "next";
import { Providers } from "@/components/context/Providers";
import { getMessages, getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
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
			<head />
			<body>
				<NextIntlClientProvider messages={messages} locale={locale}>
					<Providers>
						<main className="container mx-auto px-4 py-8">{children}</main>
					</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
