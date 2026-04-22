import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
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
  title: "Command Center — by Creative Division",
  description: "Your personal app launchpad. Ventures, tools, and builds at a glance.",
  openGraph: {
    title: "Command Center — by Creative Division",
    description: "Your personal app launchpad. Ventures, tools, and builds at a glance.",
    images: [{ url: "/api/og", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Command Center — by Creative Division",
    description: "Your personal app launchpad. Ventures, tools, and builds at a glance.",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[oklch(0.06_0.015_270)]">
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "oklch(0.15 0.01 270 / 90%)",
              border: "1px solid oklch(1 0 0 / 10%)",
              color: "oklch(0.95 0 0)",
              backdropFilter: "blur(16px)",
            },
          }}
        />
      </body>
    </html>
  );
}
