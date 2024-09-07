import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Chattanooga Video Wall",
	description: "Share your favorite Chattanooga moments",
	icons: {
		apple: "/favicon.ico",
		shortcut: "/favicon.ico",
		icon: "/favicon.ico",
	},
	openGraph: {
		title: "Chattanooga Video Wall",
		description: "Share your favorite Chattanooga moments",
		url: "https://foundercloud.live",
		siteName: "Founder Cloud",
		images: ["https://www.chatt.video/og.png"],
	},
	twitter: {
		card: "summary_large_image",
		title: "Founder Cloud",
		description: "Share your favorite Chattanooga moments",
		images: ["https://www.chatt.video/og.png"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html suppressHydrationWarning lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
