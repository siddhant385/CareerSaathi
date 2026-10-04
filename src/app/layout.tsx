import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppNavigationShell } from "@/components/app-navigation-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerSaathi - Vocational Guidance for Families",
  description:
    "AI-enabled, family-centred career counselling and vocational guidance platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground pb-16 md:pb-0">
        <AppNavigationShell />
        <div className="flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  );
}
