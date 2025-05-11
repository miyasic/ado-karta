import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Header } from "@/components/Header";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface PageParams {
  locale: string;
}

interface GenerateMetadataProps {
  params: Promise<PageParams>;
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<PageParams>;
}

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const t = await getTranslations({ locale, namespace: 'GlobalMetadata' });

  const siteTitle = t('siteTitle');
  const siteDescription = t('siteDescription');

  return {
    title: siteTitle,
    description: siteDescription,
    icons: {
      icon: '/favicon.png',
    },
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      type: "website",
      url: "/",
      images: [
        {
          url: '/ogp.png',
          alt: siteTitle,
        },
      ],
      siteName: siteTitle,
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDescription,
      images: ['/ogp.png'],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<RootLayoutProps>) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  const messages = await getMessages({ locale });
  const headerMessages = messages.Header ? { Header: messages.Header } : {};

  return (
    <html lang={locale} className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <NextIntlClientProvider locale={locale} messages={headerMessages}>
          <Header locale={locale} />
        </NextIntlClientProvider>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
