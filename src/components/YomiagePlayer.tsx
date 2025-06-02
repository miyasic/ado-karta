'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import YouTube, { type YouTubePlayer, type YouTubeProps } from 'react-youtube';
import { useTranslations } from 'next-intl';

interface Karta {
    title: string;
    youtubeId: string;
    startSeconds: number;
    isFake?: boolean;
}

interface YomiagePlayerProps {
    initialKartaData: Karta[];
}

const GAME_STATE_STORAGE_KEY = 'yomiageGameState';

interface KartaIdWithFakeFlag {
    youtubeId: string;
    isFake?: boolean;
}

interface GameState {
    shuffledPlaylistItems: KartaIdWithFakeFlag[];
    currentIndex: number;
}

// フェイクカルタを挿入するヘルパー関数
function _insertFakeKarta<T extends Karta>(
    initialArray: T[], // フェイク挿入前のシャッフル済み配列
    numConsideredLateGame: number,
    enableFakes: boolean // ★追加: フェイクを有効にするかのフラグ
): { arrayWithFakes: T[], fakesInsertedCount: number } {
    // カルタが3枚以下ならフェイク挿入処理を行わない
    // または enableFakes が false ならフェイク挿入処理を行わない
    if (!enableFakes || initialArray.length <= 3) {
        return { arrayWithFakes: [...initialArray], fakesInsertedCount: 0 };
    }

    let fakesInsertedCount = 0;
    const resultWithFakes: T[] = [...initialArray]; // 初期状態は元の配列のコピー

    // 元の配列における終盤の開始インデックスを計算
    const lateGameStartIndexOriginal = Math.max(0, initialArray.length - numConsideredLateGame);

    let currentIndex = 0;
    while (currentIndex < resultWithFakes.length) {
        // 現在処理している要素のインデックスが、元の配列基準の終盤開始インデックス以上であれば
        // フェイクを挿入するチャンスがある
        if (currentIndex >= lateGameStartIndexOriginal) {
            if (Math.random() < 0.5) { // 50%の確率でフェイクを挿入
                // フェイクの元ネタを、resultWithFakes の最初から「現在処理中の要素の一つ前」までの中からランダムに選ぶ
                // currentIndex >= lateGameStartIndexOriginal であり、lateGameStartIndexOriginal >= 1 なので currentIndex は常に1以上。
                const fakeSourceIndex = Math.floor(Math.random() * currentIndex);
                const sourceKarta = resultWithFakes[fakeSourceIndex];

                if (sourceKarta) {
                    const fakeKarta = { ...sourceKarta, isFake: true } as T;

                    // 現在処理している要素の直前にフェイクを挿入
                    resultWithFakes.splice(currentIndex, 0, fakeKarta);
                    fakesInsertedCount++;
                    // フェイクを挿入した場合、次に処理する currentIndex はループの最後でインクリメントされるため、
                    // 新しく挿入されたフェイクが次のイテレーションの対象になる。
                }
            }
        }
        currentIndex++;
    }
    return { arrayWithFakes: resultWithFakes, fakesInsertedCount };
}

function shuffleArray<T extends Karta>(array: T[], enableFakes: boolean): T[] {
    let currentIndex = array.length, randomIndex;
    const newArray = [...array];

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [newArray[currentIndex], newArray[randomIndex]] = [
            newArray[randomIndex], newArray[currentIndex]];
    }

    const initialArrayLength = newArray.length; // フェイク挿入前の配列長を保持
    const numToConsiderForFake = 3;

    const result = _insertFakeKarta(newArray, numToConsiderForFake, enableFakes);
    const finalArray = result.arrayWithFakes;
    const fakesCount = result.fakesInsertedCount;

    // フェイク挿入前のカルタが3枚より多かった場合のみログ出力（元の挙動を維持）
    if (initialArrayLength > 3) {
        console.log("Shuffled array with fakes:", finalArray);
        console.log("Number of fakes inserted:", fakesCount);
    }
    return finalArray;
}

export function YomiagePlayer({ initialKartaData }: YomiagePlayerProps) {
    const t = useTranslations('YomiagePlayer');
    const [allKarta] = useState<Karta[]>(initialKartaData);
    const [shuffledPlaylist, setShuffledPlaylist] = useState<Karta[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [showPlayerPlaceholder, setShowPlayerPlaceholder] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isVideoReady, setIsVideoReady] = useState<boolean>(false);

    const playerRef = useRef<YouTubePlayer | null>(null);

    const initializePlaylist = useCallback(() => {
        try {
            // ローカルストレージからフェイクモード設定を読み込む
            const fakeModeSettingString = typeof window !== 'undefined' ? localStorage.getItem('shuffleFakeModeEnabled') : null;
            const enableFakes = fakeModeSettingString ? JSON.parse(fakeModeSettingString) : false; // デフォルトはfalse

            if (allKarta.length > 0) {
                const shuffled = shuffleArray(allKarta, enableFakes);

                setShuffledPlaylist(shuffled);
                setCurrentIndex(0);
                setShowPlayerPlaceholder(true);
                setIsPlaying(false);
                if (typeof window !== 'undefined') {
                    localStorage.setItem(GAME_STATE_STORAGE_KEY, JSON.stringify({ shuffledPlaylistItems: shuffled.map(k => ({ youtubeId: k.youtubeId, isFake: k.isFake })), currentIndex: 0 }));
                }
            } else {
                setShuffledPlaylist([]);
                setCurrentIndex(-1);
                setShowPlayerPlaceholder(false);
                setIsPlaying(false);
                if (typeof window !== 'undefined') {
                    localStorage.removeItem(GAME_STATE_STORAGE_KEY);
                }
            }
        } finally {
            setIsLoading(false);
        }
    }, [allKarta]);

    const handleReset = useCallback(() => {
        setIsLoading(true);
        playerRef.current?.stopVideo();
        if (typeof window !== 'undefined') {
            localStorage.removeItem(GAME_STATE_STORAGE_KEY);
        }
        initializePlaylist();
    }, [initializePlaylist]);

    useEffect(() => {
        setIsLoading(true);
        if (typeof window !== 'undefined') {
            window.addEventListener('resetYomiageGame', handleReset);

            const savedStateString = localStorage.getItem(GAME_STATE_STORAGE_KEY);
            if (savedStateString) {
                try {
                    const savedState: GameState = JSON.parse(savedStateString);
                    const restoredPlaylist = savedState.shuffledPlaylistItems.map(item => {
                        const kartaFromMaster = allKarta.find(k => k.youtubeId === item.youtubeId);
                        if (kartaFromMaster) {
                            return { ...kartaFromMaster, isFake: item.isFake };
                        }
                        return undefined;
                    }).filter(karta => karta !== undefined) as Karta[];

                    if (restoredPlaylist.length > 0 && savedState.currentIndex >= 0 && savedState.currentIndex < restoredPlaylist.length) {
                        setShuffledPlaylist(restoredPlaylist);
                        setCurrentIndex(savedState.currentIndex);
                        setShowPlayerPlaceholder(true);
                        setIsPlaying(false);
                        setIsLoading(false);
                        return;
                    }
                } catch (e) {
                    console.error("Failed to parse saved game state:", e);
                    localStorage.removeItem(GAME_STATE_STORAGE_KEY);
                }
            }
        }
        initializePlaylist();

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resetYomiageGame', handleReset);
            }
        };
    }, [initializePlaylist, allKarta, handleReset]);

    useEffect(() => {
        if (typeof window !== 'undefined' && shuffledPlaylist.length > 0 && currentIndex >= 0) {
            const currentGameState: GameState = { shuffledPlaylistItems: shuffledPlaylist.map(k => ({ youtubeId: k.youtubeId, isFake: k.isFake })), currentIndex };
            localStorage.setItem(GAME_STATE_STORAGE_KEY, JSON.stringify(currentGameState));
        }
    }, [currentIndex, shuffledPlaylist]);

    // localStorageの変更を他のタブと同期するためのuseEffect
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === GAME_STATE_STORAGE_KEY && event.newValue) {
                try {
                    const newState: GameState = JSON.parse(event.newValue);
                    const newPlaylist = newState.shuffledPlaylistItems.map(item => {
                        const kartaFromMaster = allKarta.find(k => k.youtubeId === item.youtubeId);
                        if (kartaFromMaster) {
                            return { ...kartaFromMaster, isFake: item.isFake };
                        }
                        return undefined;
                    }).filter(karta => karta !== undefined) as Karta[];

                    // 現在のステートと比較し、変更がある場合のみ更新
                    if (JSON.stringify(newPlaylist.map(k => ({ youtubeId: k.youtubeId, isFake: k.isFake }))) !== JSON.stringify(shuffledPlaylist.map(k => ({ youtubeId: k.youtubeId, isFake: k.isFake }))) || newState.currentIndex !== currentIndex) {
                        setShuffledPlaylist(newPlaylist);
                        setCurrentIndex(newState.currentIndex);
                        // 他のタブで操作された可能性があるので、再生状態をリセット
                        setIsPlaying(false);
                        setShowPlayerPlaceholder(true);
                        playerRef.current?.stopVideo(); // 動画も停止
                    }
                } catch (e) {
                    console.error("Failed to parse an updated game state from storage:", e);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [allKarta, currentIndex, shuffledPlaylist]); // allKarta, currentIndex, shuffledPlaylist を依存配列に追加

    const currentKarta = currentIndex >= 0 && currentIndex < shuffledPlaylist.length
        ? shuffledPlaylist[currentIndex]
        : null;

    const loadAndPlayVideo = (karta: Karta) => {
        const player = playerRef.current;
        if (player && karta) {
            let startSeconds = karta.startSeconds;
            if (typeof window !== 'undefined') {
                const introModeEnabled = localStorage.getItem('introModeEnabled');
                if (introModeEnabled && JSON.parse(introModeEnabled)) {
                    startSeconds = 0; // イントロモードが有効なら再生開始時間を0に
                }
            }
            player.loadVideoById({
                videoId: karta.youtubeId,
                startSeconds: startSeconds
            });
        } else {
            console.error('Player instance not available or karta is null.');
        }
    };

    const handleNextCard = () => {
        if (currentIndex < shuffledPlaylist.length - 1) {
            setIsPlaying(false);
            setIsVideoReady(false);
            playerRef.current?.stopVideo();
            setCurrentIndex(prevIndex => prevIndex + 1);
            setShowPlayerPlaceholder(true);
        }
    };

    const handlePreviousCard = () => {
        if (currentIndex > 0) {
            setIsPlaying(false);
            setIsVideoReady(false);
            playerRef.current?.stopVideo();
            setCurrentIndex(prevIndex => prevIndex - 1);
            setShowPlayerPlaceholder(true);
        }
    };

    const handlePlayClick = () => {
        if (currentKarta && isVideoReady) {
            setShowPlayerPlaceholder(false);
            loadAndPlayVideo(currentKarta);
        }
    };

    const totalCount = shuffledPlaylist.filter(karta => !karta.isFake).length;
    const isFinished = currentIndex >= shuffledPlaylist.length - 1;
    const readCount = shuffledPlaylist.slice(0, currentIndex + 1).filter(karta => !karta.isFake).length;

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
        // 動画の準備が完了したらisVideoReadyをtrueに設定
        setIsVideoReady(true);
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
                {isLoading ? t('loadingData') :
                    totalCount === 0 ? t('noKartaData') :
                        t('cardStatus', { readCount, totalCount })}
            </div>

            <div className="w-full aspect-video mb-6 bg-black rounded-lg overflow-hidden shadow-lg flex items-center justify-center relative">
                <YouTube
                    videoId={currentKarta?.youtubeId ?? ''}
                    opts={opts}
                    onReady={onReady}
                    onStateChange={onStateChange}
                    onError={(e) => {
                        console.error("Player Error:", e);
                        setIsVideoReady(false);
                    }}
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ visibility: (!isLoading && currentKarta && !showPlayerPlaceholder) ? 'visible' : 'hidden' }}
                />
                {!isLoading && showPlayerPlaceholder && currentKarta && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePlayClick}
                        className={`w-20 h-20 transition-colors duration-200 z-10 ${isVideoReady ? 'text-blue-500 hover:text-blue-600' : 'text-gray-400 cursor-not-allowed'}`}
                        aria-label={t('playButtonAriaLabel')}
                        disabled={!isVideoReady}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
                            <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                        </svg>
                    </Button>
                )}
                {(isLoading || totalCount === 0) && !currentKarta && (
                    <div className="text-gray-500 z-10">
                        {isLoading ? t('loadingData') :
                            totalCount === 0 ? t('noKartaData') :
                                null}
                    </div>
                )}
            </div>

            <div className="flex justify-center items-center space-x-4 mb-4">
                {currentIndex > 0 && (
                    <Button
                        onClick={handlePreviousCard}
                        size="lg"
                        variant="secondary"
                        disabled={isLoading || currentIndex <= 0}
                    >
                        {t('previousCardButton')}
                    </Button>
                )}
                <Button
                    onClick={isFinished ? handleReset : handleNextCard}
                    size="lg"
                    disabled={isLoading || totalCount === 0 || !isPlaying}
                >
                    {isLoading ? t('nextCardButton') : (isFinished ? t('playAgainButton') : t('nextCardButton'))}
                </Button>
            </div>
        </div>
    );
} 
