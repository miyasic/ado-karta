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

interface PageParams {
    locale: string;
}

interface YomiagePageProps {
    params: Promise<PageParams>;
}

export default async function YomiagePage({ params }: YomiagePageProps) {
    const resolvedParams = await params;
    const locale = resolvedParams.locale;
    console.log("現在の言語:", locale);

    const allMessages = await getMessages({ locale });
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
            <NextIntlClientProvider locale={locale} messages={yomiagePlayerMessages}>
                <YomiagePlayer initialKartaData={kartaData} />
            </NextIntlClientProvider>
        </main>
    );
}
