'use client';

import { useState, useRef } from 'react';
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
    const [allKarta] = useState<Karta[]>(initialKartaData); // 全データ（不変）
    const [remainingKarta, setRemainingKarta] = useState<Karta[]>(initialKartaData); // 未読の札
    const [currentKarta, setCurrentKarta] = useState<Karta | null>(null); // 現在表示中の札
    const [readCount, setReadCount] = useState<number>(0); // 読んだ枚数
    const [isFinished, setIsFinished] = useState<boolean>(false); // 終了フラグ
    // 再生プレースホルダー表示状態を追加
    const [showPlayerPlaceholder, setShowPlayerPlaceholder] = useState<boolean>(false);

    // YouTube プレイヤーインスタンスを保持する Ref
    const playerRef = useRef<YouTubePlayer | null>(null);

    // 動画をロードして再生する関数
    const loadAndPlayVideo = (karta: Karta) => {
        const player = playerRef.current;
        if (player && karta) {
            console.log(`API: Loading video ${karta.youtubeId} starting at ${karta.startSeconds}`);
            // loadVideoById は videoId と startSeconds を持つオブジェクトを受け取る
            player.loadVideoById({
                videoId: karta.youtubeId,
                startSeconds: karta.startSeconds
            });
            // playVideo を明示的に呼ぶ必要は通常ない (loadVideoById が再生を開始させるため)
            // ただし、環境によっては必要になる場合もあるので、もし loadVideoById だけでは
            // 再生されない場合は player.playVideo() を試す価値はある。
        } else {
            console.error('Player instance not available or karta is null.');
        }
    };

    const handleNextCard = () => {
        console.log("handleNextCard called");
        if (isFinished) {
            setRemainingKarta(allKarta);
            setCurrentKarta(null);
            setReadCount(0);
            setIsFinished(false);
            setShowPlayerPlaceholder(false);
            playerRef.current?.stopVideo(); // プレイヤーを停止
            return;
        }

        const isFirstRead = readCount === 0;
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

        if (isFirstRead) {
            // 最初の読み上げ: すぐに動画をロードして再生
            setShowPlayerPlaceholder(false);
            // playerRef が準備できていれば再生、できていなければ onReady で再生されることを期待
            if (playerRef.current) {
                loadAndPlayVideo(nextKarta);
            } else {
                // onReady より先にここに来る可能性は低いが念のため
                console.log('Player not ready yet, will play on ready.');
            }
        } else {
            // 2回目以降: プレースホルダーを表示
            setShowPlayerPlaceholder(true);
            playerRef.current?.stopVideo(); // 前の動画を停止
        }
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
        playerRef.current = event.target; // プレイヤーインスタンスを保存
        // もし最初のカードが選択済みで、プレイヤーがまだ再生されていなければ再生
        if (readCount === 1 && currentKarta && !showPlayerPlaceholder) {
            // isFirstRead のタイミングで playerRef が null だった場合のフォールバック
            console.log("Playing video on ready because it was the first read.");
            loadAndPlayVideo(currentKarta);
        }
    };

    // 再生状態が変わったときのハンドラ（デバッグ用）
    const onStateChange = (event: { data: number }) => {
        // -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
        console.log("Player State Changed:", event.data);
    };

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
            <div className="w-full aspect-video mb-6 bg-black rounded-lg overflow-hidden shadow-lg flex items-center justify-center relative">
                {/* 常にYouTubeコンポーネントをレンダリングしておく */}
                <YouTube
                    videoId={''} // 初期videoIdは空文字列にする
                    opts={opts}
                    onReady={onReady}
                    onStateChange={onStateChange} // デバッグ用
                    onError={(e) => console.error("Player Error:", e)} // エラーハンドリング
                    className="absolute top-0 left-0 w-full h-full" // iframeをコンテナいっぱいに広げる
                    style={{ visibility: (currentKarta && !showPlayerPlaceholder && !isFinished) ? 'visible' : 'hidden' }} // プレースホルダー表示時や初期/終了時は非表示
                />

                {/* プレースホルダー表示 */}
                {showPlayerPlaceholder && currentKarta && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePlayClick}
                        className="w-20 h-20 text-gray-400 hover:text-white transition-colors duration-200 z-10" // z-10でYouTubeコンポーネントより手前に
                        aria-label="再生する"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
                            <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                        </svg>
                    </Button>
                )}

                {/* 初期状態または終了状態のメッセージ */}
                {!currentKarta && !showPlayerPlaceholder && (
                    <div className="text-gray-500 z-10">
                        {isFinished ? 'お疲れ様でした！' : '「読み上げ開始」を押してください'}
                    </div>
                )}
            </div>

            {/* 操作ボタン */}
            <Button
                onClick={() => {
                    console.log("Main button clicked!");
                    handleNextCard();
                }}
                size="lg">
                {isFinished ? 'もう一回遊ぶ' : readCount === 0 ? '読み上げ開始' : '次の札へ'}
            </Button>
        </div>
    );
} 