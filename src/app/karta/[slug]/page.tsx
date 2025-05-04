import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Kartaデータの型定義 (一覧ページと同じもの)
interface Karta {
    id: string;
    title: string;
    youtubeId: string;
    startSeconds: number;
}

// 指定されたIDのカルタデータを取得する関数
async function getKartaData(id: string): Promise<Karta | undefined> {
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'karta.json');
    try {
        const fileContents = await fs.readFile(jsonPath, 'utf8');
        const kartaData: Karta[] = JSON.parse(fileContents);
        return kartaData.find((karta) => karta.id === id);
    } catch (error) {
        console.error('Failed to read or parse karta.json:', error);
        return undefined; // エラー時は undefined を返す
    }
}

// 再生ページのコンポーネント
export default async function KartaDetailPage({ params }: { params: { slug: string } }) {
    const karta = await getKartaData(params.slug);

    // カルタデータが見つからない場合は404ページを表示
    if (!karta) {
        notFound();
    }

    const youtubeEmbedUrl = `https://www.youtube.com/embed/${karta.youtubeId}?start=${karta.startSeconds}&autoplay=1`; // autoplay=1 を追加して自動再生

    return (
        <main className="container mx-auto px-4 py-8 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6 text-center">{karta.title}</h1>

            {/* YouTube Player (iframe) */}
            <div className="w-full max-w-3xl aspect-video mb-6 bg-black rounded-lg overflow-hidden shadow-lg">
                <iframe
                    width="100%"
                    height="100%"
                    src={youtubeEmbedUrl}
                    title={`YouTube video player for ${karta.title}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                ></iframe>
            </div>

            {/* 一覧へ戻るリンク */}
            <Link href="/" className="text-blue-500 hover:text-blue-400 hover:underline">
                ← 一覧へ戻る
            </Link>
        </main>
    );
}

// (任意) ビルド時に静的ルートを生成するための設定
// 大量のカルタがある場合に有効ですが、少ない場合はなくても動作します
// export async function generateStaticParams() {
//   const jsonPath = path.join(process.cwd(), 'src', 'data', 'karta.json');
//   try {
//     const fileContents = await fs.readFile(jsonPath, 'utf8');
//     const kartaData: Karta[] = JSON.parse(fileContents);
//     return kartaData.map((karta) => ({
//       slug: karta.id,
//     }));
//   } catch (error) {
//     console.error('Failed to generate static params:', error);
//     return [];
//   }
// } 