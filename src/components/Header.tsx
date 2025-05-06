'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button'; // shadcn/ui の Button を使う
import { version } from '../../package.json'; // package.json から version をインポート

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="p-4 relative"> {/* relative を追加してメニューの位置基準にする */}
            <div className="container mx-auto flex justify-between items-center">
                {/* ロゴ */}
                <Link href="/" className="inline-block">
                    <Image
                        src="/logo.png"
                        alt="Ado かるた ロゴ"
                        width={120}
                        height={80}
                        priority
                    />
                </Link>

                {/* メニューボタン */}
                <Button variant="ghost" size="icon" onClick={toggleMenu}>
                    <Image
                        src="/menu.png"
                        alt="メニューを開く"
                        width={60}
                        height={60}
                    />
                </Button>
            </div>

            {/* ドロップダウンメニュー (isMenuOpenがtrueの時に表示) */}
            {isMenuOpen && (
                <div className="absolute top-full right-4 w-48 bg-muted border rounded-md shadow-lg z-50">
                    <ul className="py-1">
                        <li>
                            <Link
                                href="/list"
                                className="block px-4 py-2 text-sm hover:bg-accent transition-colors duration-150"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                カルタ一覧
                            </Link>
                        </li>
                        {/* 「このサイトについて」を追加 */}
                        <li>
                            <Link
                                href="/about" // 将来的に作成するページへのパス
                                className="block px-4 py-2 text-sm hover:bg-accent transition-colors duration-150"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                このサイトについて
                            </Link>
                        </li>
                        {/* バージョン表示を追加 */}
                        <li>
                            <span className="block px-4 py-2 text-xs text-muted-foreground">
                                Version: {version}
                            </span>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
} 