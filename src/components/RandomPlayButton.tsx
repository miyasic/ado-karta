'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

// page.tsx から渡される Karta データの型
interface Karta {
    id: string;
    // 他のプロパティ（title, youtubeId, etc.）はこのコンポーネントでは不要
}

interface RandomPlayButtonProps {
    kartaData: Karta[];
}

export function RandomPlayButton({ kartaData }: RandomPlayButtonProps) {
    const router = useRouter();

    const handleRandomPlay = () => {
        if (kartaData.length === 0) {
            // データがない場合は何もしない（またはエラー表示）
            console.warn('No karta data available for random play.');
            return;
        }

        // ランダムなインデックスを生成
        const randomIndex = Math.floor(Math.random() * kartaData.length);
        const randomKarta = kartaData[randomIndex];

        // ランダムに選ばれたカルタの再生ページへ遷移
        router.push(`/karta/${randomKarta.id}`);
    };

    return (
        <Button onClick={handleRandomPlay} disabled={kartaData.length === 0}>
            おまかせ再生
        </Button>
    );
} 