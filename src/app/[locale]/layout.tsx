import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Header } from "@/components/Header";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

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
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: "Ado かるた",
    description: "Adoの楽曲を使ったファンメイドのかるた読み上げアプリです。一覧表示やシャッフル再生機能があります。",
    type: "website",
    url: "/",
    images: [
      {
        url: '/ogp.png',
        alt: 'Ado かるた ',
      },
    ],
    siteName: "Ado かるた",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ado かるた",
    description: "Adoの楽曲を使ったファンメイドのかるた読み上げアプリです。一覧表示やシャッフル再生機能があります。",
    images: ['/ogp.png'],
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const { locale } = params;
  const messages = await getMessages({ locale });

  const headerMessages = messages.Header ? { Header: messages.Header } : {};

  return (
    <html lang={locale} className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <NextIntlClientProvider locale={locale} messages={headerMessages}>
          <Header />
        </NextIntlClientProvider>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
