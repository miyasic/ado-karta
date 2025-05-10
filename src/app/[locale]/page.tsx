import { promises as fs } from 'fs';
import path from 'path';
import { YomiagePlayer } from "@/components/YomiagePlayer";
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

interface Karta {
    title: string;
    youtubeId: string;
    startSeconds: number;
}

export default async function YomiagePage({ params }: { params: { locale: string } }) {

    const allMessages = await getMessages({ locale: params.locale });
    const yomiagePlayerMessages = allMessages.YomiagePlayer
        ? { YomiagePlayer: allMessages.YomiagePlayer }
        : {};

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
            <NextIntlClientProvider locale={params.locale} messages={yomiagePlayerMessages}>
                <YomiagePlayer initialKartaData={kartaData} />
            </NextIntlClientProvider>
        </main>
    );
}
