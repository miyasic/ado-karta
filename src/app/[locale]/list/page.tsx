import { promises as fs } from 'fs';
import path from 'path';
import { KartaList } from "@/components/KartaList";
import { getTranslations, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

interface Karta {
    title: string;
    titleEn?: string;
    youtubeId: string;
    startSeconds: number;
}

interface PageParams {
    locale: string;
}

interface ListPageProps {
    params: Promise<PageParams>;
}

export default async function ListPage({ params }: ListPageProps) {
    const resolvedParams = await params;
    const locale = resolvedParams.locale;

    const t = await getTranslations({ locale, namespace: 'ListPage' });
    const messages = await getMessages({ locale });

    const jsonPath = path.join(process.cwd(), 'src', 'data', 'karta.json');
    let kartaData: Karta[] = [];

    try {
        const fileContents = await fs.readFile(jsonPath, 'utf8');
        kartaData = JSON.parse(fileContents);
    } catch (error) {
        console.error('Failed to read or parse karta.json:', error);
    }

    return (
        <main className="container mx-auto px-4 py-8">
            {kartaData.length > 0 ? (
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <KartaList kartaData={kartaData} />
                </NextIntlClientProvider>
            ) : (
                <p className="text-center text-gray-500">{t('noKartaDataLoaded')}</p>
            )}
        </main>
    );
} 