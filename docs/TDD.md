# Ado Karta Web - Technical Design Document

## 🎯 概要

Adoのベストアルバム特典カルタの読み上げ機能を提供し、対応するYouTube公式動画を、画面遷移なしで指定の秒数から再生するWebアプリケーション。**カルタ一覧表示機能 (`/list`) では、カードクリックでその場に動画を埋め込み再生する。**
著作権に配慮し、動画・音声はすべてYouTube公式の埋め込みを使用。

---

## 🏗 アーキテクチャ

### フロントエンド
- **Next.js 14**（App Router）
- **TypeScript**
- **shadcn/ui + Tailwind CSS** （クール/ダークなトンマナ）

### データ管理
- **JSONファイル**（初期、手入力で作成）
- Firestore（将来：動的データ管理用）

### 動画再生
- **YouTube iframe**（srcを動的に変更、**読み上げページと一覧ページの両方で使用**）

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
    / page.tsx （読み上げページ）
    / list/page.tsx （カルタ一覧）
  / components
    YomiagePlayer.tsx （読み上げ機能のUI・状態管理）
    KartaCard.tsx （一覧ページ用、**クリックによる動画表示制御含む**）
    YoutubePlayer.tsx （読み上げページで使用）
  / data
    karta.json
/ styles
  globals.css

---

## 🔧 コンポーネント設計

### YomiagePlayer (Client Component)
- props: kartaData (全カルタ情報)
- state: remainingKarta (未読札リスト), currentKarta (現在読んでいる札), readCount (読んだ枚数)
- 機能: 「次へ」ボタン、ランダム札選択、状態更新、iframeのsrc動的設定

### KartaCard (Client Component or contains Client Component)
- props: title, youtubeId, startSeconds, id
- state (internal or passed up): isPlaying (動画表示中か)
- 機能: 一覧ページ (`/list`) で札の表示。クリックで動画プレイヤーを**カード内（またはモーダルなど）**に表示/非表示。場合によっては `ListPage` 全体をクライアントコンポーネントにする必要あり。

### YoutubePlayer (読み上げページ用)
- props: youtubeId, startSeconds
- 機能: YouTube動画を指定秒数から再生（iframeラッパー、YomiagePlayer内で使用）

---

## 🚦 ルーティング

| パス                  | 内容                     |
|-----------------------|--------------------------|
| `/`                   | 読み上げページ         |
| `/list`               | カルタ一覧ページ       |

---

## ⚠ 注意事項（著作権）

- YouTube公式動画のみ使用
- YouTubeポリシーに従い広告や制約を守る

---

## ⚙️ エラーハンドリング方針（MVP）

- **データ不備**: 不正なデータを持つカルタは読み上げ/一覧から除外。
- **ページが見つからない場合 (404)**: Next.js 標準の404ページを表示 (主に `/` と `/list`)。
- **YouTube Player エラー**: YouTube iframe が表示するデフォルトのエラーに依存。
- **読み上げ終了**: 全ての札を読み上げ終わったら、その旨を表示する。
