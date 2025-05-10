import { promises as fs } from 'fs';
import path from 'path';
import { KartaList } from "@/components/KartaList";
import { getTranslations } from 'next-intl/server';

interface Karta {
    title: string;
    youtubeId: string;
    startSeconds: number;
}

export default async function ListPage({ params }: { params: { locale: string } }) {
    const t = await getTranslations({ locale: params.locale, namespace: 'ListPage' });

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
                <KartaList kartaData={kartaData} />
            ) : (
                <p className="text-center text-gray-500">{t('noKartaDataLoaded')}</p>
            )}
        </main>
    );
} 