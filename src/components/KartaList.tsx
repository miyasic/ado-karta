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
    titleEn?: string;
    youtubeId: string;
    startSeconds: number;
}

interface KartaListProps {
    kartaData: Karta[];
    locale: string;
}

export function KartaList({ kartaData, locale }: KartaListProps) {
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

                // 表示タイトルの決定
                let displayTitle;
                let iframeTitle;
                if (locale === 'en') {
                    if (karta.titleEn) {
                        displayTitle = (
                            <>
                                {karta.titleEn}
                                <br />
                                <span className="text-sm text-muted-foreground">{karta.title}</span>
                            </>
                        );
                        iframeTitle = `${karta.titleEn} (${karta.title})`;
                    } else {
                        displayTitle = karta.title; // 英語タイトルがない場合は日本語タイトルのみ
                        iframeTitle = karta.title;
                    }
                } else {
                    displayTitle = karta.title; // 日本語の場合は日本語タイトルのみ
                    iframeTitle = karta.title;
                }

                return (
                    <Card
                        key={karta.youtubeId}
                        className={`hover:shadow-lg hover:border-primary cursor-pointer dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-300 ${isPlaying ? 'border-primary scale-105' : ''}`}
                        onClick={() => handleCardClick(karta.youtubeId)}
                    >
                        <CardHeader>
                            <CardTitle className="text-lg">{displayTitle}</CardTitle>
                        </CardHeader>
                        {isPlaying && (
                            <CardContent>
                                <div className="aspect-video bg-black rounded-md overflow-hidden">
                                    <iframe
                                        key={karta.youtubeId}
                                        width="100%"
                                        height="100%"
                                        src={youtubeEmbedUrl}
                                        title={`YouTube video player for ${iframeTitle}`}
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