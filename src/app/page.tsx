// ここに読み上げ機能のページを実装します

import { promises as fs } from 'fs';
import path from 'path';
import { YomiagePlayer } from "@/components/YomiagePlayer";

// Kartaデータの型定義
interface Karta {
  id: string;
  title: string;
  youtubeId: string;
  startSeconds: number;
}

export default async function YomiagePage() {

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
    // エラーハンドリング: MVPではコンソールにエラー表示し、空の配列 or エラー表示
    // ここでは空配列を渡し、YomiagePlayer側でデータがない場合の表示を行う
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Ado かるた</h1>
      {/* YomiagePlayer コンポーネントを配置し、カルタデータを渡す */}
      <YomiagePlayer initialKartaData={kartaData} />
    </main>
  );
}
