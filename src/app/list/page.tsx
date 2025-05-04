// import Link from "next/link"; // 不要
import { promises as fs } from 'fs';
import path from 'path';
// Card 関連のインポートは KartaList に移動したので不要
// import {
//     Card,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
import { KartaList } from "@/components/KartaList"; // 作成したコンポーネントをインポート

// Kartaデータの型定義 (KartaListでも使うので、別ファイルに切り出すのも良い)
interface Karta {
    id: string;
    title: string;
    youtubeId: string;
    startSeconds: number;
}

// ListPage はサーバーコンポーネントのまま
export default async function ListPage() {
    // JSONファイルのパスを取得
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'karta.json');
    let kartaData: Karta[] = [];

    try {
        // JSONファイルを読み込む
        const fileContents = await fs.readFile(jsonPath, 'utf8');
        // JSONデータをパース
        kartaData = JSON.parse(fileContents);
    } catch (error) {
        console.error('Failed to read or parse karta.json:', error);
        // エラーハンドリング: MVPではコンソールにエラー表示し、空の配列を使用
    }


    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">カルタ一覧</h1>
            {kartaData.length > 0 ? (
                // リスト表示部分を KartaList コンポーネントに任せる
                <KartaList kartaData={kartaData} />
            ) : (
                <p className="text-center text-gray-500">カルタデータを読み込めませんでした。</p>
            )}
        </main>
    );
} 