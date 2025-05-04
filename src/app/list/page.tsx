import Link from "next/link";
import { promises as fs } from 'fs';
import path from 'path';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
// import { RandomPlayButton } from "@/components/RandomPlayButton"; // 不要なので削除

// Kartaデータの型定義
interface Karta {
    id: string;
    title: string;
    youtubeId: string;
    startSeconds: number;
}

// コンポーネント名を ListPage に変更
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
            <h1 className="text-3xl font-bold mb-8 text-center">カルタ一覧</h1> {/* タイトル変更 */}
            {/* RandomPlayButton の表示部分を削除 */}
            {kartaData.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {kartaData.map((karta) => (
                        <Link href={`/karta/${karta.id}`} key={karta.id}>
                            <Card className="h-full hover:shadow-lg hover:border-primary cursor-pointer dark:bg-gray-800 dark:hover:bg-gray-700 block transform transition duration-300 hover:scale-105">
                                <CardHeader>
                                    <CardTitle className="text-lg">{karta.title}</CardTitle>
                                </CardHeader>
                                {/* CardContent など、将来的に他の情報を表示する場合に追加 */}
                                {/* <CardContent>
                  <p>ここに詳細などを表示...</p>
                </CardContent> */}
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">カルタデータを読み込めませんでした。</p>
            )}
        </main>
    );
} 