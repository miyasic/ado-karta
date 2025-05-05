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
    // 再生プレースホルダー表示状態を追加
    const [showPlayerPlaceholder, setShowPlayerPlaceholder] = useState<boolean>(false);

    // YouTube Player の URL を生成
    const youtubeEmbedUrl = currentKarta
        ? `https://www.youtube.com/embed/${currentKarta.youtubeId}?start=${currentKarta.startSeconds}&autoplay=1`
        : '';

    // 次の札を読む処理
    const handleNextCard = () => {
        if (isFinished) {
            // リセット処理
            setRemainingKarta(allKarta);
            setCurrentKarta(null);
            setReadCount(0);
            setIsFinished(false);
            setShowPlayerPlaceholder(false); // プレースホルダーも非表示
            return;
        }

        // 最初の札読み上げ時は即座に iframe を表示するため、
        // プレースホルダー表示フラグはまだ立てない
        const isFirstRead = readCount === 0;

        if (remainingKarta.length === 0) {
            setIsFinished(true);
            setCurrentKarta(null);
            setShowPlayerPlaceholder(false);
            return;
        }

        const randomIndex = Math.floor(Math.random() * remainingKarta.length);
        const nextKarta = remainingKarta[randomIndex];

        setCurrentKarta(nextKarta);
        setRemainingKarta(remainingKarta.filter((karta) => karta.youtubeId !== nextKarta.youtubeId));
        setReadCount(readCount + 1);
        setIsFinished(false);
        // 最初の読み上げでない場合のみ、プレースホルダーを表示する
        if (!isFirstRead) {
            setShowPlayerPlaceholder(true);
        } else {
            // 最初の読み上げの場合は、明示的にプレースホルダーを非表示にする
            // (前の状態を引きずらないように念のため)
            setShowPlayerPlaceholder(false);
        }
    };

    const handlePlayClick = () => {
        setShowPlayerPlaceholder(false); // プレースホルダーを非表示にして iframe を表示
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

            {/* 動画プレイヤーエリア */}
            <div className="w-full aspect-video mb-6 bg-black rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
                {showPlayerPlaceholder && currentKarta ? (
                    // プレースホルダー表示 (再生ボタン)
                    <Button
                        variant="ghost" // 背景なしボタン
                        size="icon" // アイコン用サイズ
                        onClick={handlePlayClick}
                        className="w-20 h-20 text-gray-400 hover:text-white transition-colors duration-200"
                        aria-label="再生する"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
                            <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                        </svg>
                    </Button>
                ) : currentKarta && !isFinished ? (
                    // iframe 表示 (最初の読み上げ時、またはプレースホルダーがクリックされた後)
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
                    // 初期状態または終了状態のメッセージ
                    <div className="text-gray-500">
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