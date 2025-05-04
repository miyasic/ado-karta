'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

// page.tsx から渡される Karta データの型
interface Karta {
    title: string;
    youtubeId: string;
    startSeconds: number;
}

interface YomiagePlayerProps {
    initialKartaData: Karta[];
}

export function YomiagePlayer({ initialKartaData }: YomiagePlayerProps) {
    const [allKarta] = useState<Karta[]>(initialKartaData); // 全データ（不変）
    const [remainingKarta, setRemainingKarta] = useState<Karta[]>(initialKartaData); // 未読の札
    const [currentKarta, setCurrentKarta] = useState<Karta | null>(null); // 現在表示中の札
    const [readCount, setReadCount] = useState<number>(0); // 読んだ枚数
    const [isFinished, setIsFinished] = useState<boolean>(false); // 終了フラグ

    // YouTube Player の URL を生成
    const youtubeEmbedUrl = currentKarta
        ? `https://www.youtube.com/embed/${currentKarta.youtubeId}?start=${currentKarta.startSeconds}&autoplay=1`
        : '';

    // 次の札を読む処理
    const handleNextCard = () => {
        // もし終了状態でボタンが押されたらリセットする
        if (isFinished) {
            setRemainingKarta(allKarta); // 未読リストを全データに戻す
            setCurrentKarta(null);
            setReadCount(0);
            setIsFinished(false);
            return;
        }

        if (remainingKarta.length === 0) {
            setIsFinished(true);
            setCurrentKarta(null); // 最後の札が終わったらプレイヤーをクリア
            return;
        }

        // ランダムなインデックスを生成
        const randomIndex = Math.floor(Math.random() * remainingKarta.length);
        const nextKarta = remainingKarta[randomIndex];

        // 状態を更新
        setCurrentKarta(nextKarta);
        setRemainingKarta(remainingKarta.filter((karta) => karta.youtubeId !== nextKarta.youtubeId));
        setReadCount(readCount + 1);
        setIsFinished(false); // 念のためリセット
    };

    const totalCount = allKarta.length;

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
            {/* 状況表示 */}
            <div className="text-xl mb-4 font-semibold">
                {isFinished ? '読み上げ終了！' :
                    readCount > 0 ? `${readCount} / ${totalCount} 枚目` :
                        '準備完了'}
            </div>

            {/* 現在の札タイトル */}
            <div className="text-2xl mb-6 h-8"> {/* 高さを確保してレイアウト崩れを防ぐ */}
                {currentKarta && !isFinished ? currentKarta.title : ''}
            </div>

            {/* YouTube Player (iframe) */}
            <div className="w-full aspect-video mb-6 bg-black rounded-lg overflow-hidden shadow-lg">
                {currentKarta && !isFinished ? (
                    <iframe
                        key={currentKarta.youtubeId}
                        width="100%"
                        height="100%"
                        src={youtubeEmbedUrl}
                        title={`YouTube video player for ${currentKarta.title}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                        {isFinished ? 'お疲れ様でした！' : '「読み上げ開始」を押してください'}
                    </div>
                )}
            </div>

            {/* 操作ボタン */}
            <Button onClick={handleNextCard} size="lg">
                {isFinished ? 'もう一回遊ぶ' : readCount === 0 ? '読み上げ開始' : '次の札へ'}
            </Button>
        </div>
    );
} 