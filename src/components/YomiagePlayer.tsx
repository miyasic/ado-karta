'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import YouTube from 'react-youtube';
import type { YouTubePlayer } from 'react-youtube'; // 型定義をインポート

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
    const [allKarta] = useState<Karta[]>(initialKartaData);
    // 初期状態を空にして useEffect で設定する
    const [remainingKarta, setRemainingKarta] = useState<Karta[]>([]);
    const [currentKarta, setCurrentKarta] = useState<Karta | null>(null);
    const [readCount, setReadCount] = useState<number>(0);
    const [isFinished, setIsFinished] = useState<boolean>(false);
    // 最初からプレースホルダーを表示するので初期値を true に変更…と思ったが、
    // データがない場合に備え、useEffect で設定する方が安全
    const [showPlayerPlaceholder, setShowPlayerPlaceholder] = useState<boolean>(false);

    const playerRef = useRef<YouTubePlayer | null>(null);

    // --- 初期化処理 --- 
    useEffect(() => {
        // マウント時または initialKartaData が変更された時に最初のカードを設定
        if (initialKartaData.length > 0) {
            const randomIndex = Math.floor(Math.random() * initialKartaData.length);
            const firstKarta = initialKartaData[randomIndex];

            setCurrentKarta(firstKarta);
            setRemainingKarta(initialKartaData.filter(k => k.youtubeId !== firstKarta.youtubeId));
            setReadCount(1);
            setIsFinished(false);
            setShowPlayerPlaceholder(true); // 最初からプレースホルダーを表示
        } else {
            // データがない場合はリセット状態に
            setRemainingKarta([]);
            setCurrentKarta(null);
            setReadCount(0);
            setIsFinished(true); // データがないので即終了扱い
            setShowPlayerPlaceholder(false);
        }
    }, [initialKartaData]); // initialKartaData を依存配列に追加
    // --------------- 

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
        if (isFinished) {
            // リセット処理 (useEffect が再度実行されるように initialKartaData を使って初期化)
            if (allKarta.length > 0) {
                const randomIndex = Math.floor(Math.random() * allKarta.length);
                const firstKarta = allKarta[randomIndex];
                setCurrentKarta(firstKarta);
                setRemainingKarta(allKarta.filter(k => k.youtubeId !== firstKarta.youtubeId));
                setReadCount(1);
                setIsFinished(false);
                setShowPlayerPlaceholder(true); // プレースホルダー表示
            } else {
                // データがない場合はリセットしても終了状態
                setRemainingKarta([]);
                setCurrentKarta(null);
                setReadCount(0);
                setIsFinished(true);
                setShowPlayerPlaceholder(false);
            }
            playerRef.current?.stopVideo();
            return;
        }

        if (remainingKarta.length === 0) {
            setIsFinished(true);
            setCurrentKarta(null);
            setShowPlayerPlaceholder(false);
            playerRef.current?.stopVideo();
            return;
        }

        const randomIndex = Math.floor(Math.random() * remainingKarta.length);
        const nextKarta = remainingKarta[randomIndex];

        setCurrentKarta(nextKarta);
        setRemainingKarta(remainingKarta.filter((karta) => karta.youtubeId !== nextKarta.youtubeId));
        setReadCount(readCount + 1);
        setIsFinished(false);
        // 常にプレースホルダーを表示する
        setShowPlayerPlaceholder(true);
        playerRef.current?.stopVideo(); // 前の動画を停止
    };

    // プレースホルダーがクリックされたときの処理
    const handlePlayClick = () => {
        if (currentKarta) {
            setShowPlayerPlaceholder(false);
            loadAndPlayVideo(currentKarta);
        }
    };

    const totalCount = allKarta.length;

    // YouTubeコンポーネントのオプション
    const opts = {
        height: '100%', // コンテナに合わせる
        width: '100%',  // コンテナに合わせる
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0, // APIで制御するのでここでは 0
            controls: 1, // コントロール表示
            modestbranding: 1, // YouTubeロゴを控えめに
            rel: 0, // 関連動画を表示しない
        },
    };

    // プレイヤーが準備できたときに呼ばれる関数
    const onReady = (event: { target: YouTubePlayer }) => {
        console.log("Player Ready");
        playerRef.current = event.target;
    };

    // 再生状態が変わったときのハンドラ（デバッグ用）
    const onStateChange = (event: { data: number }) => {
        // -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
        console.log("Player State Changed:", event.data);
    };

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
            {/* 状況表示 (初期状態でも枚数を表示) */}
            <div className="text-xl mb-4 font-semibold">
                {isFinished && totalCount > 0 ? '読み上げ終了！' :
                    isFinished && totalCount === 0 ? 'データがありません' :
                        readCount > 0 ? `${readCount} / ${totalCount} 枚目` :
                            '読み込み中...'} {/* 初期化中の表示 */}
            </div>

            {/* 動画プレイヤーエリア */}
            <div className="w-full aspect-video mb-6 bg-black rounded-lg overflow-hidden shadow-lg flex items-center justify-center relative">
                {/* 常にYouTubeコンポーネントをレンダリングしておく */}
                <YouTube
                    videoId={currentKarta?.youtubeId ?? ''} // 初期カードのIDを渡す (または空文字)
                    opts={opts}
                    onReady={onReady}
                    onStateChange={onStateChange}
                    onError={(e) => console.error("Player Error:", e)}
                    className="absolute top-0 left-0 w-full h-full"
                    // 初期状態でも非表示にする条件を追加
                    style={{ visibility: (currentKarta && !showPlayerPlaceholder && !isFinished) ? 'visible' : 'hidden' }}
                />

                {/* プレースホルダー表示 */}
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

                {/* 初期状態または終了状態のメッセージ */}
                {/* 初期化中は currentKarta が null なのでこの条件には合致しないはず */}
                {(!currentKarta || isFinished) && !showPlayerPlaceholder && (
                    <div className="text-gray-500 z-10">
                        {isFinished && totalCount > 0 ? 'お疲れ様でした！' :
                            isFinished && totalCount === 0 ? 'カルタデータが見つかりません' :
                                '読み込み中...'}
                    </div>
                )}
            </div>

            {/* 操作ボタン (初期テキストを「次の札へ」に) */}
            <Button
                onClick={() => {
                    console.log("Main button clicked!");
                    handleNextCard();
                }}
                size="lg"
                disabled={totalCount === 0} // データがない場合は非活性
            >
                {isFinished ? 'もう一回遊ぶ' : '次の札へ'} {/* readCount === 0 の分岐を削除 */}
            </Button>
        </div>
    );
} 