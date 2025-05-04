
# Ado Karta Web

**Adoカルタ読み上げ（YouTube再生）Webアプリ**

Adoのベストアルバム特典カルタを元に、読み札に対応した楽曲のYouTube公式動画を該当秒数から再生するWebアプリです。

---

## 🔥 機能概要

- カルタ札の一覧表示
- 各札クリックで該当楽曲の公式YouTube動画を指定秒数から再生
- レスポンシブ対応（スマホ・PC）

---

## 🏗 技術スタック

| 項目            | 技術                     |
|-----------------|--------------------------|
| フレームワーク  | Next.js 14（App Router） |
| UI              | shadcn/ui + Tailwind CSS |
| 動画再生        | YouTube iframe埋め込み    |
| データ管理      | JSONファイル（ローカル）  |
| ホスティング    | Vercel                    |

---

## 📁 ディレクトリ構成（予定）

/src
  /app
    /page.tsx （カルタ一覧）
    /karta/[slug]/page.tsx （再生ページ）
  /components
    KartaCard.tsx
    YoutubePlayer.tsx
  /data
    karta.json （札データ）
  /public
    /images（将来：札画像）
/styles
  globals.css

---

## 📝 開発ステップ（MVP）

1. Next.jsプロジェクト作成
2. shadcn/ui導入
3. カルタJSON作成
4. 一覧ページ実装
5. YouTube再生ページ実装
6. レスポンシブ対応
7. Vercelにデプロイ

---

## ⚠ 著作権・ポリシー

- YouTube公式動画のみ埋め込み
- 歌詞テキストや音声の自前提供は行わない
- 広告スキップ・不正操作なし

---

## 🚀 今後の拡張候補

- Firestore管理による札データの動的更新
- PWA対応
- 札画像表示
- SNSシェア機能
