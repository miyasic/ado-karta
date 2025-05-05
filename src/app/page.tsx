import { promises as fs } from 'fs';
import path from 'path';
import { YomiagePlayer } from "@/components/YomiagePlayer";

interface Karta {
  title: string;
  youtubeId: string;
  startSeconds: number;
}

export default async function YomiagePage() {

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
      <h1 className="text-3xl font-bold mb-8 text-center">Ado かるた</h1>
      <YomiagePlayer initialKartaData={kartaData} />
    </main>
  );
}
