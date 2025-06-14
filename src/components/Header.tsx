'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import pkg from '../../package.json';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';

export function Header() {
    const t = useTranslations('Header');
    const locale = useLocale();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false); // 設定モーダル用の state
    const [isIntroMode, setIsIntroMode] = useState(false); // イントロモード用の state を追加
    const [isShuffleFakeModeEnabled, setIsShuffleFakeModeEnabled] = useState(false); // フェイクモード用のstate
    const [isMobile, setIsMobile] = useState(false); // モバイル判定用のstate

    useEffect(() => {
        // localStorageからイントロモードの設定を読み込む
        const storedIntroMode = localStorage.getItem('introModeEnabled');
        if (storedIntroMode) {
            setIsIntroMode(JSON.parse(storedIntroMode));
        }
        const storedShuffleFakeMode = localStorage.getItem('shuffleFakeModeEnabled'); // ローカルストレージから読み込み
        if (storedShuffleFakeMode) {
            setIsShuffleFakeModeEnabled(JSON.parse(storedShuffleFakeMode));
        }

        // モバイル判定
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // 初回レンダリング時にチェック
        checkIfMobile();

        // リサイズイベントでもチェック
        window.addEventListener('resize', checkIfMobile);

        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    const handleIntroModeChange = (checked: boolean) => {
        setIsIntroMode(checked);
        localStorage.setItem('introModeEnabled', JSON.stringify(checked));
    };

    const handleShuffleFakeModeChange = (checked: boolean) => { // フェイクモード変更ハンドラ
        setIsShuffleFakeModeEnabled(checked);
        localStorage.setItem('shuffleFakeModeEnabled', JSON.stringify(checked));
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const otherLocale = locale === 'ja' ? 'en' : 'ja';
    const linkText = locale === 'ja' ? t('switchToEnglish') : t('switchToJapanese');

    const basePathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), '') || '';
    const languageSwitchHref = `/${otherLocale}${basePathWithoutLocale}`;

    const isYomiagePage = pathname === `/${locale}` || pathname === '/';

    // メニューボタン用のアニメーション画像の選択
    const menuImageSrc = isMobile
        ? "/menu5.png"  // モバイルでは最終フレーム（5枚目）を表示
        : "/menu1.png"; // PCでは1枚目を表示

    return (
        <header className="p-4 relative">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="inline-block">
                    <Image
                        src="/logo.png"
                        alt={t('logoAlt')}
                        width={120}
                        height={80}
                        priority
                    />
                </Link>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMenu}
                    className={`menu-button ${isMobile ? "" : "hover-animation"}`}
                >
                    <div style={{ transform: isMobile ? 'scale(1)' : 'scale(1.2)' }}>
                        <Image
                            src={menuImageSrc}
                            alt={t('menuOpenAlt')}
                            width={60}
                            height={60}
                        />
                    </div>
                </Button>
            </div>

            {/* CSS for menu button hover animation */}
            <style jsx global>{`
                @keyframes menuAnimation {
                    0% { content: url('/menu1.png'); }
                    25% { content: url('/menu2.png'); }
                    50% { content: url('/menu3.png'); }
                    75% { content: url('/menu4.png'); }
                    100% { content: url('/menu5.png'); }
                }
                
                .menu-button.hover-animation:hover img {
                    animation: menuAnimation 0.5s steps(1) forwards;
                }
                
                .menu-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>

            {isMenuOpen && (
                <div className="absolute top-full right-4 w-48 bg-muted border rounded-md shadow-lg z-50">
                    <ul className="py-1">
                        <li>
                            <Link
                                href={`/${locale}/list`}
                                className="block px-4 py-2 text-sm hover:bg-accent transition-colors duration-150"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {t('linkKartaList')}
                            </Link>
                        </li>
                        {isYomiagePage && (
                            <li>
                                <button
                                    className="w-full text-left block px-4 py-2 text-sm hover:bg-accent transition-colors duration-150"
                                    onClick={() => {
                                        setIsDialogOpen(true);
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    {t('settings')}
                                </button>
                            </li>
                        )}
                        <li>
                            <Link
                                href={`/${locale}/about`}
                                className="block px-4 py-2 text-sm hover:bg-accent transition-colors duration-150"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {t('linkAboutThisSite')}
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={`/${locale}/release-notes`}
                                className="block px-4 py-2 text-sm hover:bg-accent transition-colors duration-150"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {t('linkReleaseNotes')}
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={languageSwitchHref}
                                className="block px-4 py-2 text-sm hover:bg-accent transition-colors duration-150"
                                onClick={() => setIsMenuOpen(false)}
                                locale={otherLocale}
                            >
                                {linkText}
                            </Link>
                        </li>
                        <li>
                            <span className="block px-4 py-2 text-xs text-muted-foreground">
                                Version: {pkg.version}
                            </span>
                        </li>
                    </ul>
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-muted">
                    <DialogHeader>
                        <DialogTitle>{t('settingsTitle')}</DialogTitle>
                        <DialogDescription>
                            {t('settingsDescription')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="intro-mode"
                                checked={isIntroMode}
                                onCheckedChange={handleIntroModeChange}
                            />
                            <Label htmlFor="intro-mode">{t('settingIntroMode')}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="shuffle-fake-mode"
                                checked={isShuffleFakeModeEnabled}
                                onCheckedChange={handleShuffleFakeModeChange}
                            />
                            <Label htmlFor="shuffle-fake-mode">{t('settingEnableShuffleFakeMode')}</Label>
                        </div>
                    </div>
                    {isYomiagePage && (
                        <div className="mt-4">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    window.dispatchEvent(new CustomEvent('resetYomiageGame'));
                                    setIsDialogOpen(false);
                                }}
                            >
                                {t('buttonResetGame')}
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </header>
    );
} 
