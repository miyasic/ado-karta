import releaseNotesData from '@/data/release-notes.json';
import { ReleaseNotes, ReleaseNote } from '@/types/release-notes';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // shadcn/uiのCardを使用
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; // shadcn/uiのAccordionを使用

const releaseNotes: ReleaseNotes = releaseNotesData as ReleaseNotes;

export default function ReleaseNotesPage() {
    if (!releaseNotes || releaseNotes.length === 0) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">リリースノート</h1>
                <p>リリースノートはまだありません。</p>
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
                <h1 className="text-3xl font-bold tracking-tight">リリースノート</h1>
                <p className="text-muted-foreground mt-1">
                    ado-karta の最新の変更点や新機能についてお知らせします。
                </p>
            </header>

            <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                {sortedReleaseNotes.map((note: ReleaseNote, index: number) => (
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
                                    {note.changes.newFeatures && note.changes.newFeatures.length > 0 && (
                                        <div className="mb-4">
                                            <h3 className="font-semibold text-lg mb-2 text-green-500 dark:text-green-400">🚀 新機能</h3>
                                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                                {note.changes.newFeatures.map((feature, i) => (
                                                    <li key={`new-${i}`}>{feature}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {note.changes.improvements && note.changes.improvements.length > 0 && (
                                        <div className="mb-4">
                                            <h3 className="font-semibold text-lg mb-2 text-blue-500 dark:text-blue-400">✨ 改善点</h3>
                                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                                {note.changes.improvements.map((improvement, i) => (
                                                    <li key={`imp-${i}`}>{improvement}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {note.changes.bugFixes && note.changes.bugFixes.length > 0 && (
                                        <div className="mb-4"> {/* bugFixesセクションにもmb-4を追加 */}
                                            <h3 className="font-semibold text-lg mb-2 text-red-500 dark:text-red-400">🐛 バグ修正</h3>
                                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                                {note.changes.bugFixes.map((fix, i) => (
                                                    <li key={`fix-${i}`}>{fix}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {(!note.changes.newFeatures || note.changes.newFeatures.length === 0) &&
                                        (!note.changes.improvements || note.changes.improvements.length === 0) &&
                                        (!note.changes.bugFixes || note.changes.bugFixes.length === 0) && (
                                            <p className="text-muted-foreground text-sm">このバージョンでの主な変更点はありません。</p>
                                        )}
                                </CardContent>
                            </Card>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
} 