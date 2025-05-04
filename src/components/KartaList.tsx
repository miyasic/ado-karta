"use client";

import { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// データ型定義
interface Karta {
    title: string;
    youtubeId: string;
    startSeconds: number;
}

interface KartaListProps {
    kartaData: Karta[];
}

export function KartaList({ kartaData }: KartaListProps) {
    const [playingYoutubeId, setPlayingYoutubeId] = useState<string | null>(null);

    const handleCardClick = (youtubeId: string) => {
        // すでに再生中のカードをクリックしたら停止、そうでなければ再生開始
        setPlayingYoutubeId(playingYoutubeId === youtubeId ? null : youtubeId);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {kartaData.map((karta) => {
                const isPlaying = karta.youtubeId === playingYoutubeId;
                const youtubeEmbedUrl = isPlaying
                    ? `https://www.youtube.com/embed/${karta.youtubeId}?start=${karta.startSeconds}&autoplay=1`
                    : '';

                return (
                    <Card
                        key={karta.youtubeId}
                        className={`hover:shadow-lg hover:border-primary cursor-pointer dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-300 ${isPlaying ? 'border-primary scale-105' : ''}`}
                        onClick={() => handleCardClick(karta.youtubeId)}
                    >
                        <CardHeader>
                            <CardTitle className="text-lg">{karta.title}</CardTitle>
                        </CardHeader>
                        {isPlaying && (
                            <CardContent>
                                <div className="aspect-video bg-black rounded-md overflow-hidden">
                                    <iframe
                                        key={karta.youtubeId}
                                        width="100%"
                                        height="100%"
                                        src={youtubeEmbedUrl}
                                        title={`YouTube video player for ${karta.title}`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                );
            })}
        </div>
    );
} 