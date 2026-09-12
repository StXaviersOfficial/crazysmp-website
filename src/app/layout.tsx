import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CrazySMP — Minecraft SMP Season 4",
  description: "A heavily customized vanilla+ Minecraft SMP where creativity meets chaos. Build your kingdom, forge alliances, and write your legacy.",
  keywords: ["CrazySMP", "Minecraft", "SMP", "Survival", "Multiplayer", "Season 4", "Vanilla+"],
  authors: [{ name: "CrazyAnishXD" }],
  openGraph: {
    title: "CrazySMP — Minecraft SMP Season 4",
    description: "Build your kingdom, forge alliances, and write your legacy.",
    url: "https://www.crazysmp.bond",
    siteName: "CrazySMP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrazySMP — Minecraft SMP Season 4",
    description: "Build your kingdom, forge alliances, and write your legacy.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
