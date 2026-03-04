import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChatGPT++ — Performance-first enhancement layer for ChatGPT",
  description:
    "ChatGPT++ is a Chrome extension that enhances ChatGPT with performance fixes, bulk actions, chat vault, context intelligence, and more. No tracking. No external servers.",
  openGraph: {
    title: "ChatGPT++ — Performance-first enhancement layer for ChatGPT",
    description:
      "Performance-first enhancement layer for serious ChatGPT users.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-black text-white grain`}
      >
        {children}
      </body>
    </html>
  );
}
