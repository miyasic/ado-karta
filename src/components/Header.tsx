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

    useEffect(() => {
        // localStorageからイントロモードの設定を読み込む
        const storedIntroMode = localStorage.getItem('introModeEnabled');
        if (storedIntroMode) {
            setIsIntroMode(JSON.parse(storedIntroMode));
        }
    }, []);

    const handleIntroModeChange = (checked: boolean) => {
        setIsIntroMode(checked);
        localStorage.setItem('introModeEnabled', JSON.stringify(checked));
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const otherLocale = locale === 'ja' ? 'en' : 'ja';
    const linkText = locale === 'ja' ? t('switchToEnglish') : t('switchToJapanese');

    const basePathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), '') || '';
    const languageSwitchHref = `/${otherLocale}${basePathWithoutLocale}`;

    const isYomiagePage = pathname === `/${locale}` || pathname === '/';

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

                <Button variant="ghost" size="icon" onClick={toggleMenu}>
                    <Image
                        src="/menu.png"
                        alt={t('menuOpenAlt')}
                        width={60}
                        height={60}
                    />
                </Button>
            </div>

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
                            <Switch id="fake-last-card" />
                            <Label htmlFor="fake-last-card">{t('settingFakeLastCard')}</Label>
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
                    {/* DialogFooter は、将来的に「保存」ボタンなどを追加する場合のために残しておくことも可能 */}
                    {/* <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter> */}
                </DialogContent>
            </Dialog>
        </header>
    );
} 
