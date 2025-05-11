'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button'; // shadcn/ui の Button を使う
import pkg from '../../package.json'; // package.json から version をインポート
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation'; // usePathname を追加

// Propsの型定義を追加
interface HeaderProps {
    locale: string;
}

export function Header({ locale }: HeaderProps) { // localeをpropsから受け取る
    const t = useTranslations('Header'); // 追加
    const pathname = usePathname(); // 現在のパスを取得
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // 言語切り替えのロジック
    const otherLocale = locale === 'ja' ? 'en' : 'ja';
    const linkText = locale === 'ja' ? t('switchToEnglish') : t('switchToJapanese');

    // 現在のパスからロケールプレフィックスを除去したベースパスを取得
    // 例: /ja/list -> /list, /en -> "", /ja -> ""
    const basePathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), '') || '';
    // 切り替え後のhrefを生成。ベースパスが空（ルート）の場合はロケールのみ、それ以外はロケール＋ベースパス
    const languageSwitchHref = `/${otherLocale}${basePathWithoutLocale}`;

    console.log("Language switch params:", {
        pathname,
        locale, // propsから受け取ったlocaleを使用
        otherLocale,
        finalLinkHref: languageSwitchHref
    });

    return (
        <header className="p-4 relative"> {/* relative を追加してメニューの位置基準にする */}
            <div className="container mx-auto flex justify-between items-center">
                {/* ロゴ */}
                <Link href={`/${locale}/`} className="inline-block"> {/* propsのlocaleを使用し、hrefを修正 */}
                    <Image
                        src="/logo.png"
                        alt={t('logoAlt')} // 修正
                        width={120}
                        height={80}
                        priority
                    />
                </Link>

                {/* メニューボタン */}
                <Button variant="ghost" size="icon" onClick={toggleMenu}>
                    <Image
                        src="/menu.png"
                        alt={t('menuOpenAlt')} // 修正
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
                                href={`/${locale}/list`} // propsのlocaleを使用し、hrefを修正
                                className="block px-4 py-2 text-sm hover:bg-accent transition-colors duration-150"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {t('linkKartaList')} {/* 修正 */}
                            </Link>
                        </li>
                        {/* 「このサイトについて」を追加 */}
                        <li>
                            <Link
                                href={`/${locale}/about`} // propsのlocaleを使用し、hrefを修正
                                className="block px-4 py-2 text-sm hover:bg-accent transition-colors duration-150"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {t('linkAboutThisSite')} {/* 修正 */}
                            </Link>
                        </li>
                        {/* リリースノートへのリンクを追加 */}
                        <li>
                            <Link
                                href={`/${locale}/release-notes`} // propsのlocaleを使用し、hrefを修正
                                className="block px-4 py-2 text-sm hover:bg-accent transition-colors duration-150"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {t('linkReleaseNotes')}
                            </Link>
                        </li>
                        <li>
                            <button
                                className="w-full text-left block px-4 py-2 text-sm hover:bg-accent transition-colors duration-150"
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    window.dispatchEvent(new CustomEvent('resetYomiageGame'));
                                }}
                            >
                                {t('buttonResetGame')} {/* 修正 */}
                            </button>
                        </li>
                        {/* 言語切り替えボタンを追加 */}
                        <li>
                            <Link
                                href={languageSwitchHref}
                                className="block px-4 py-2 text-sm hover:bg-accent transition-colors duration-150"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {linkText}
                            </Link>
                        </li>
                        {/* バージョン表示を追加 */}
                        <li>
                            <span className="block px-4 py-2 text-xs text-muted-foreground">
                                Version: {pkg.version}
                            </span>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
} 