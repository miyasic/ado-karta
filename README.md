# Ado かるた

**Adoさんのベストアルバム特典カルタを元にしたファンメイドのかるた読み上げアプリ**

Adoさんのベストアルバム「Adoのベストアドバム」のデラックスBOX盤（完全数量限定）特典「Adoのベストアドバム特製カルタ」を、YouTube動画と連携させてより楽しく遊ぶために作成した非公式のファンサイトです。

---

## 🔥 機能

- **読み上げ機能 (トップページ `/`)**: シャッフル再生、進む/戻る、リセット機能。
- **一覧表示機能 (`/list`)**: 全カード表示、カード内クリック再生。
- **その他**: ダークモード、レスポンシブ対応。

---

## 🌐 サイトURL

- **プロジェクト**: [Vercel](https://vercel.com/miyasics-projects/ado-karta)
- **サービス**: [ado-karta.vercel.app](https://ado-karta.vercel.app/)

---

## 🏗 技術スタック (概要)

- **Frontend**: Next.js (App Router), TypeScript, shadcn/ui, Tailwind CSS
- **Video**: react-youtube
- **Internationalization**: next-intl
- **Hosting**: Vercel
- **Analytics**: Vercel Analytics

(詳細は [`docs/TDD.md`](./docs/TDD.md) を参照)

---

## 🚀 使い方

- **読み上げ**: トップページ (`/`) で再生ボタン (▶️) をクリック。
- **一覧**: ヘッダーメニューまたは `/list` にアクセスし、カードをクリック。
- **サイト情報**: ヘッダーメニューの「このサイトについて」から。

---

## 🛠️ セットアップ (開発者向け)

1.  リポジトリをクローン: `git clone https://github.com/miyasic/ado-karta.git`
2.  依存関係をインストール: `npm install` (または `yarn install`)
3.  開発サーバーを起動: `npm run dev` (または `yarn dev`)
4.  ブラウザで `http://localhost:3000` を開く

---

## ⚠ 注意事項

- 非公式のファンサイトです。
- データは手入力のため誤りがある可能性があります。

---

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細については、`LICENSE` ファイルをご覧ください。
