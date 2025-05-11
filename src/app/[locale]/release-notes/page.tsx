import { useLocale, useTranslations } from 'next-intl';
import releaseNotesData from '@/data/release-notes.json';
import { ReleaseNotes, ReleaseNote, LocalizedChanges } from '@/types/release-notes';
import { Card, CardContent } from "@/components/ui/card"; // shadcn/uiのCardを使用
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; // shadcn/uiのAccordionを使用

const releaseNotes: ReleaseNotes = releaseNotesData as ReleaseNotes;

export default function ReleaseNotesPage() {
    const locale = useLocale();
    const t = useTranslations('ReleaseNotesPage');

    if (!releaseNotes || releaseNotes.length === 0) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
                <p>{t('noNotes')}</p>
            </div>
        );
    }

    // 日付の降順（新しいものが上）にソート
    const sortedReleaseNotes = [...releaseNotes].sort((a, b) =>
        new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    );

    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
                <p className="text-muted-foreground mt-1">
                    {t('description')}
                </p>
            </header>

            <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                {sortedReleaseNotes.map((note: ReleaseNote, index: number) => {
                    // 現在のロケールに対応する変更内容を取得、なければ日本語(ja)をフォールバックとして使用
                    const currentChanges: LocalizedChanges | undefined = note.changes[locale] || note.changes['ja'];

                    // もし currentChanges が undefined (つまり ja も存在しない稀なケース) なら何も表示しないか、エラー表示
                    if (!currentChanges) {
                        return (
                            <AccordionItem value={`item-error-${index}`} key={`error-${note.version}`}>
                                <AccordionTrigger className="text-xl text-red-500">
                                    Error: Could not load changes for {note.version}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-muted-foreground">Release note data might be corrupted.</p>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    }

                    return (
                        <AccordionItem value={`item-${index}`} key={note.version}>
                            <AccordionTrigger className="text-xl">
                                <div className="flex justify-between w-full pr-4">
                                    <span>{note.version}</span>
                                    <span className="text-sm text-muted-foreground font-normal">{note.releaseDate}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <Card className="mt-2 shadow-sm">
                                    <CardContent className="pt-6">
                                        {currentChanges.newFeatures && currentChanges.newFeatures.length > 0 && (
                                            <div className="mb-4">
                                                <h3 className="font-semibold text-lg mb-2 text-green-500 dark:text-green-400">{t('newFeaturesTitle')}</h3>
                                                <ul className="list-none pl-0 space-y-3">
                                                    {currentChanges.newFeatures.map((feature, i) => (
                                                        <li key={`new-${i}`} className="border-l-4 border-green-500 pl-3">
                                                            <p className="font-medium">{feature.title}</p>
                                                            {feature.descriptions && feature.descriptions.length > 0 && (
                                                                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-muted-foreground">
                                                                    {feature.descriptions.map((desc, j) => (
                                                                        <li key={`new-desc-${i}-${j}`}>{desc}</li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {currentChanges.improvements && currentChanges.improvements.length > 0 && (
                                            <div className="mb-4">
                                                <h3 className="font-semibold text-lg mb-2 text-blue-500 dark:text-blue-400">{t('improvementsTitle')}</h3>
                                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                                    {currentChanges.improvements.map((improvement, i) => (
                                                        <li key={`imp-${i}`}>{improvement}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {currentChanges.bugFixes && currentChanges.bugFixes.length > 0 && (
                                            <div className="mb-4">
                                                <h3 className="font-semibold text-lg mb-2 text-red-500 dark:text-red-400">{t('bugFixesTitle')}</h3>
                                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                                    {currentChanges.bugFixes.map((fix, i) => (
                                                        <li key={`fix-${i}`}>{fix}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {(!currentChanges.newFeatures || currentChanges.newFeatures.length === 0) &&
                                            (!currentChanges.improvements || currentChanges.improvements.length === 0) &&
                                            (!currentChanges.bugFixes || currentChanges.bugFixes.length === 0) && (
                                                <p className="text-muted-foreground text-sm">{t('noChanges')}</p>
                                            )}
                                    </CardContent>
                                </Card>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
} 