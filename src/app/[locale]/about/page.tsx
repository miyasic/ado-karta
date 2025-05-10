import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    const resolvedParam = await params;
    const locale = resolvedParam.locale;

    const t = await getTranslations({ locale, namespace: 'AboutPage' });
    return {
        title: t('metadataTitle'),
        description: t('metadataDescription'),
    };
}

export default async function AboutPage({ params }: { params: { locale: string } }) {
    const resolvedParam = await params;
    const locale = resolvedParam.locale;

    const t = await getTranslations({ locale, namespace: 'AboutPage' });

    return (
        <main className="container mx-auto px-4 py-8 max-w-3xl">
            <section>
                <h2 className="text-2xl font-semibold mt-8 mb-4">{t('siteOverviewTitle')}</h2>
                <p className="mb-4">
                    {t.rich('siteOverviewText1', {
                        strong: (chunks) => <strong>{chunks}</strong>,
                    })}
                </p>
                <p className="mb-4">{t('siteOverviewText2')}</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mt-8 mb-4">{t('howToPlayTitle')}</h2>
                <ul className="my-6 list-disc pl-6 space-y-4">
                    <li>
                        <strong>{t('howToPlayHomepageTitle')}</strong>
                        <br />
                        {t('howToPlayHomepageTextLine1')}
                        <br />
                        {t('howToPlayHomepageTextLine2')}
                    </li>
                    <li>
                        <strong>{t('howToPlayListPageTitle')}</strong>
                        <br />
                        {t('howToPlayListPageText')}
                    </li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mt-8 mb-4">{t('requestTitle')}</h2>
                <p className="mb-4">
                    {t.rich('requestText', {
                        linkToDeveloper: (chunks) => (
                            <a
                                href="https://x.com/sic_0917"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-primary hover:text-primary/80"
                            >
                                {chunks}
                            </a>
                        ),
                    })}
                </p>
            </section>
        </main>
    );
} 