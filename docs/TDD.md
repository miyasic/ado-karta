
# Ado Karta Web - Technical Design Document

## 🎯 概要

Adoのベストアルバム特典カルタの読み札に対応するYouTube公式動画を、指定の秒数から再生するWebアプリケーション。
著作権に配慮し、動画・音声はすべてYouTube公式の埋め込みを使用。

---

## 🏗 アーキテクチャ

### フロントエンド
- **Next.js 14**（App Router）
- **TypeScript**
- **shadcn/ui + Tailwind CSS**

### データ管理
- **JSONファイル**（初期）
- Firestore（将来：動的データ管理用）

### 動画再生
- **YouTube iframe**（`youtubeId` と `startSeconds` 指定）

### ホスティング
- **Vercel**（Next.js標準）

---

## 🔢 データ構造

### karta.json（例）

```json
[
  {
    "id": "usseewa-1",
    "title": "うっせぇわ（A札）",
    "youtubeId": "Qp3b-RXtz4w",
    "startSeconds": 42
  }
]
```

---

## 📁 ディレクトリ構成

/ src
  / app
    / page.tsx （カルタ一覧）
    / karta/[slug]/page.tsx （再生ページ）
  / components
    KartaCard.tsx
    YoutubePlayer.tsx
  / data
    karta.json
/ styles
  globals.css

---

## 🔧 コンポーネント設計

### KartaCard
- props: title, slug
- 機能: 一覧ページで札の表示

### YoutubePlayer
- props: youtubeId, startSeconds
- 機能: YouTube動画を指定秒数から再生

---

## 🚦 ルーティング

| パス                  | 内容                |
|-----------------------|---------------------|
| `/`                   | カルタ一覧ページ    |
| `/karta/[slug]`       | カルタ再生ページ    |

---

## ⚠ 注意事項（著作権）

- YouTube公式動画のみ使用
- YouTubeポリシーに従い広告や制約を守る
