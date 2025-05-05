import { promises as fs } from 'fs';
import path from 'path';
import { KartaList } from "@/components/KartaList";

interface Karta {
    title: string;
    youtubeId: string;
    startSeconds: number;
}

export default async function ListPage() {
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
            <h1 className="text-3xl font-bold mb-8 text-center">カルタ一覧</h1>
            {kartaData.length > 0 ? (
                <KartaList kartaData={kartaData} />
            ) : (
                <p className="text-center text-gray-500">カルタデータを読み込めませんでした。</p>
            )}
        </main>
    );
} 