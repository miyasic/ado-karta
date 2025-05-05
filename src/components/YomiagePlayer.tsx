'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import YouTube from 'react-youtube';
import type { YouTubePlayer, YouTubeProps } from 'react-youtube';

// page.tsx から渡される Karta データの型
interface Karta {
    title: string;
    youtubeId: string;
    startSeconds: number;
}

interface YomiagePlayerProps {
    initialKartaData: Karta[];
}

// Fisher-Yates (Knuth) シャッフルアルゴリズム
function shuffleArray<T>(array: T[]): T[] {
    let currentIndex = array.length, randomIndex;
    const newArray = [...array]; // 元の配列を変更しないようにコピー

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [newArray[currentIndex], newArray[randomIndex]] = [
            newArray[randomIndex], newArray[currentIndex]];
    }
    return newArray;
}

export function YomiagePlayer({ initialKartaData }: YomiagePlayerProps) {
    const [allKarta] = useState<Karta[]>(initialKartaData);
    const [shuffledPlaylist, setShuffledPlaylist] = useState<Karta[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [showPlayerPlaceholder, setShowPlayerPlaceholder] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const playerRef = useRef<YouTubePlayer | null>(null);

    // --- 再生リスト初期化・シャッフル関数 --- 
    const initializePlaylist = useCallback(() => {
        if (allKarta.length > 0) {
            const shuffled = shuffleArray(allKarta);
            setShuffledPlaylist(shuffled);
            setCurrentIndex(0);
            setShowPlayerPlaceholder(true);
            setIsPlaying(false);
        } else {
            setShuffledPlaylist([]);
            setCurrentIndex(-1);
            setShowPlayerPlaceholder(false);
            setIsPlaying(false);
        }
    }, [allKarta]);
    // --------------- 

    // --- マウント時に初期化 --- 
    useEffect(() => {
        initializePlaylist();
    }, [initializePlaylist]);
    // --------------- 

    const currentKarta = currentIndex >= 0 && currentIndex < shuffledPlaylist.length
        ? shuffledPlaylist[currentIndex]
        : null;

    const loadAndPlayVideo = (karta: Karta) => {
        const player = playerRef.current;
        if (player && karta) {
            console.log(`API: Loading video ${karta.youtubeId} starting at ${karta.startSeconds}`);
            player.loadVideoById({
                videoId: karta.youtubeId,
                startSeconds: karta.startSeconds
            });
        } else {
            console.error('Player instance not available or karta is null.');
        }
    };

    const handleNextCard = () => {
        console.log("handleNextCard called");
        if (currentIndex < shuffledPlaylist.length - 1) {
            setIsPlaying(false);
            playerRef.current?.stopVideo();
            setCurrentIndex(currentIndex + 1);
            setShowPlayerPlaceholder(true);
        }
    };

    const handlePreviousCard = () => {
        console.log("handlePreviousCard called");
        if (currentIndex > 0) {
            setIsPlaying(false);
            playerRef.current?.stopVideo();
            setCurrentIndex(currentIndex - 1);
            setShowPlayerPlaceholder(true);
        }
    };

    const handleReset = () => {
        console.log("handleReset called");
        playerRef.current?.stopVideo();
        initializePlaylist();
    };

    const handlePlayClick = () => {
        if (currentKarta) {
            setShowPlayerPlaceholder(false);
            loadAndPlayVideo(currentKarta);
        }
    };

    const totalCount = shuffledPlaylist.length;
    const isFinished = currentIndex >= totalCount - 1;
    const readCount = currentIndex + 1;

    const opts: YouTubeProps['opts'] = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
        },
    };

    const onReady = (event: { target: YouTubePlayer }) => {
        console.log("Player Ready");
        playerRef.current = event.target;
    };

    const onStateChange: YouTubeProps['onStateChange'] = (event) => {
        console.log("Player State Changed:", event.data);
        if (event.data === 1) {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
            <div className="text-xl mb-4 font-semibold">
                {currentIndex === -1 && totalCount > 0 ? '読み込み中...' :
                    totalCount === 0 ? 'データがありません' :
                        isFinished && !showPlayerPlaceholder ? '読み上げ終了！' :
                            `${readCount} / ${totalCount} 枚目`}
            </div>

            <div className="w-full aspect-video mb-6 bg-black rounded-lg overflow-hidden shadow-lg flex items-center justify-center relative">
                <YouTube
                    videoId={currentKarta?.youtubeId ?? ''}
                    opts={opts}
                    onReady={onReady}
                    onStateChange={onStateChange}
                    onError={(e) => console.error("Player Error:", e)}
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ visibility: (currentKarta && !showPlayerPlaceholder) ? 'visible' : 'hidden' }}
                />
                {showPlayerPlaceholder && currentKarta && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePlayClick}
                        className="w-20 h-20 text-gray-400 hover:text-white transition-colors duration-200 z-10"
                        aria-label="再生する"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
                            <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                        </svg>
                    </Button>
                )}
                {(currentIndex === -1 || (isFinished && showPlayerPlaceholder)) && (
                    <div className="text-gray-500 z-10">
                        {totalCount === 0 ? 'カルタデータが見つかりません' :
                            currentIndex === -1 ? '読み込み中...' :
                                'お疲れ様でした！'}
                    </div>
                )}
            </div>

            <div className="flex justify-center items-center space-x-4">
                {/* 前の札へボタン (currentIndex > 0 の場合のみ表示) */}
                {currentIndex > 0 && (
                    <Button
                        onClick={handlePreviousCard}
                        size="lg"
                        variant="secondary"
                    // disabled 属性は不要になる
                    // disabled={currentIndex <= 0} 
                    >
                        前の札へ
                    </Button>
                )}

                <Button
                    onClick={isFinished ? handleReset : handleNextCard}
                    size="lg"
                    disabled={totalCount === 0 || (!isFinished && !isPlaying)}
                >
                    {isFinished ? 'もう一回遊ぶ' : '次の札へ'}
                </Button>
            </div>
        </div>
    );
} 