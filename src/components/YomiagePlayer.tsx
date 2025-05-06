'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import YouTube, { type YouTubePlayer, type YouTubeProps } from 'react-youtube';

interface Karta {
    title: string;
    youtubeId: string;
    startSeconds: number;
}

interface YomiagePlayerProps {
    initialKartaData: Karta[];
}

function shuffleArray<T>(array: T[]): T[] {
    let currentIndex = array.length, randomIndex;
    const newArray = [...array];

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

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
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const playerRef = useRef<YouTubePlayer | null>(null);

    const initializePlaylist = useCallback(() => {
        try {
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
        } finally {
            setIsLoading(false);
        }
    }, [allKarta]);

    useEffect(() => {
        initializePlaylist();
    }, [initializePlaylist]);

    const currentKarta = currentIndex >= 0 && currentIndex < shuffledPlaylist.length
        ? shuffledPlaylist[currentIndex]
        : null;

    const loadAndPlayVideo = (karta: Karta) => {
        const player = playerRef.current;
        if (player && karta) {
            player.loadVideoById({
                videoId: karta.youtubeId,
                startSeconds: karta.startSeconds
            });
        } else {
            console.error('Player instance not available or karta is null.');
        }
    };

    const handleNextCard = () => {
        if (currentIndex < shuffledPlaylist.length - 1) {
            setIsPlaying(false);
            playerRef.current?.stopVideo();
            setCurrentIndex(currentIndex + 1);
            setShowPlayerPlaceholder(true);
        }
    };

    const handlePreviousCard = () => {
        if (currentIndex > 0) {
            setIsPlaying(false);
            playerRef.current?.stopVideo();
            setCurrentIndex(currentIndex - 1);
            setShowPlayerPlaceholder(true);
        }
    };

    const handleReset = () => {
        setIsLoading(true);
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
        playerRef.current = event.target;
    };

    const onStateChange: YouTubeProps['onStateChange'] = (event) => {
        // @ts-expect-error YT is globally available from YouTube IFrame API
        if (event.data === YT.PlayerState.PLAYING) {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
            <div className="text-xl mb-4 font-semibold">
                {isLoading ? 'データを読み込み中です...' :
                    totalCount === 0 ? 'カルタデータが見つかりません' :
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
                    style={{ visibility: (!isLoading && currentKarta && !showPlayerPlaceholder) ? 'visible' : 'hidden' }}
                />
                {!isLoading && showPlayerPlaceholder && currentKarta && (
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
                {(isLoading || totalCount === 0) && !currentKarta && (
                    <div className="text-gray-500 z-10">
                        {isLoading ? 'データを読み込み中です...' :
                            totalCount === 0 ? 'カルタデータが見つかりません' :
                                null}
                    </div>
                )}
            </div>

            <div className="flex justify-center items-center space-x-4">
                {currentIndex > 0 && (
                    <Button
                        onClick={handlePreviousCard}
                        size="lg"
                        variant="secondary"
                        disabled={isLoading || currentIndex <= 0}
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