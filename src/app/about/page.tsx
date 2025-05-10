import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'このサイトについて - Ado かるた',
    description: 'Ado かるた アプリの概要と目的、遊び方について説明します。',
};

export default function AboutPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-3xl">
            <section>
                <h2 className="text-2xl font-semibold mt-8 mb-4">サイト概要</h2>
                <p className="mb-4">
                    このサイトは、Adoさんのファンが作成した<strong>非公式のファンサイト</strong>です。
                </p>
                <p className="mb-4">
                    Adoさんのベストアルバム「Adoのベストアドバム」のデラックスBOX盤（完全数量限定）に
                    特典として付属された「Adoのベストアドバム特製カルタ」を、より楽しく遊ぶために作成されました。
                    お手元のかるたと合わせてお楽しみください。
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mt-8 mb-4">遊び方</h2>
                <ul className="my-6 list-disc pl-6 space-y-4">
                    <li>
                        <strong>トップページ</strong>
                        <br />
                        カルタの読み札に対応するYouTube動画の指定箇所が、ランダムな順番で再生されます。
                        画面の再生ボタンを押して読み上げを開始し、「次の札へ」「前の札へ」ボタンで操作します。
                        「もう一回遊ぶ」で再度シャッフルして最初から始められます。
                        <br />
                        ※ 途中でページをリロードしても、続きから遊ぶことができます。「もう一回遊ぶ」で最初からになります。
                    </li>
                    <li>
                        <strong>一覧ページ</strong>
                        <br />
                        全てのカルタのタイトルが表示されます。各カードをクリックすると、その場で対応するYouTube動画が再生されます。
                        各楽曲の一番盛り上がるところがカルタの札に採用されていると思うので、このページだけでも楽しめます。
                    </li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mt-8 mb-4">お願い</h2>
                <p className="mb-4">
                    最後の「やきうどん」の札だけ、YouTubeの動画がないため、その札を読み上げることができません。
                    もしやきうどんの音源を見つけた方は、<a href="https://x.com/sic_0917" target="_blank" rel="noopener noreferrer" className="underline text-primary hover:text-primary/80">開発者</a>までお願いします。
                </p>
            </section>
        </main>
    );
} 