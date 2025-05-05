import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";
import Image from "next/image";
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
  title: "Ado かるた",
  description: "Adoの楽曲を使ったファンメイドのかるた読み上げアプリです。一覧表示やシャッフル再生機能があります。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <header className="p-4">
          <Link href="/" className="inline-block">
            <Image
              src="/logo.png"
              alt="Ado かるた ロゴ"
              width={120}
              height={80}
              priority
            />
          </Link>
        </header>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
