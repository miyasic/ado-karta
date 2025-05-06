# Ado かるた - Technical Design Document (v0.9.0)

## 🎯 技術概要

Next.js (App Router), TypeScript, shadcn/ui, Tailwind CSS, react-youtube を用いて構築された、カルタ読み上げ・一覧表示Webアプリケーション。ローカルJSONデータを読み込み、Vercelにホスティングされる。

## 🏗️ アーキテクチャ

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **UI**: shadcn/ui, Tailwind CSS (ダークモード)
- **状態管理**: React Hooks (useState, useEffect, useCallback)
- **動画再生**: react-youtube (YouTube IFrame Player API ラッパー)
- **データ**: ローカル JSON ファイル (`src/data/karta.json`)
- **ホスティング**: Vercel
- **分析**: Vercel Analytics

## 🔢 データ構造 (`src/data/karta.json`)

各カルタ札に対応するオブジェクトの配列。

```json
[
  {
    "title": "札のタイトル (例: うっせぇわ)",
    "youtubeId": "YouTube動画ID",
    "startSeconds": 再生開始秒数 (number)
  }
]
```

## 📁 主要ディレクトリ構成

```
/src
├── app/
│   ├── page.tsx          # 読み上げページ (ルート)
│   ├── list/page.tsx     # 一覧ページ
│   ├── about/page.tsx    # このサイトについてページ
│   └── layout.tsx        # ルートレイアウト (ヘッダー含む)
├── components/
│   ├── Header.tsx          # 全ページ共通ヘッダー (ロゴ、メニュー)
│   ├── YomiagePlayer.tsx   # 読み上げ機能コアコンポーネント
│   └── KartaList.tsx       # 一覧表示・カード内再生コンポーネント
├── data/
│   └── karta.json        # カルタデータ
└── (types/karta.ts)    # (推奨: 共通の型定義ファイル)
/public
├── logo.png              # ヘッダーロゴ
├── menu.png              # メニューアイコン
└── favicon.png           # ファビコン
```

## 🔧 主要コンポーネント設計

### `Header.tsx` (Client Component)

- **責務**: 全ページ共通のヘッダー表示、ナビゲーションメニューの開閉と表示。
- **状態**: `isMenuOpen` (メニュー開閉状態)。
- **機能**: ロゴクリックでトップページ遷移、メニューボタンクッリックでメニュー開閉、メニュー項目クリックで各ページ遷移、バージョン情報表示 (`package.json` から取得)。

### `YomiagePlayer.tsx` (Client Component)

- **Props**: `initialKartaData` (全カルタデータ)。
- **責務**: 読み上げ機能のUIとロジック全体。
- **状態**:
    - `shuffledPlaylist`: 初期化時にシャッフルされた再生順リスト。
    - `currentIndex`: `shuffledPlaylist` 内の現在位置インデックス。
    - `showPlayerPlaceholder`: 動画再生ボタンの表示状態。
    - `isPlaying`: YouTubeプレイヤーの再生状態。
    - `isLoading`: 初期データ読み込み・処理中の状態。
- **機能**:
    - 初期化時にカルタデータをシャッフル。
    - プレースホルダー (▶️) クリックで `react-youtube` API を使用して動画再生開始。
    - 「次の札へ」「前の札へ」ボタンによる `currentIndex` の変更。
    - 「もう一回遊ぶ」ボタンによるリセット（再シャッフル）。
    - `isPlaying` 状態に基づいたボタンの活性/非活性制御。
    - ローディング状態の表示制御。

### `KartaList.tsx` (Client Component)

- **Props**: `kartaData` (全カルタデータ)。
- **責務**: カルタ一覧のグリッド表示と、カード内での動画再生制御。
- **状態**: `playingYoutubeId` (現在再生中の動画ID、`null` なら再生停止)。
- **機能**:
    - カルタデータをグリッド表示。
    - カードクリックで `playingYoutubeId` を更新し、対応する `iframe` を表示/非表示・再生/停止。
    - 一度に再生される動画は一つだけ。

## 🚦 ルーティングとページ

- `/`: 読み上げ機能ページ (`src/app/page.tsx` + `YomiagePlayer`)
- `/list`: 一覧表示ページ (`src/app/list/page.tsx` + `KartaList`)
- `/about`: このサイトについてページ (`src/app/about/page.tsx`)

## ✅ 主要な決定事項と経緯

- **初期構想からの変更**: 当初の一覧→個別ページ遷移案から、読み上げ中心 + 一覧ページ内再生へとピボット。
- **再生トリガー**: モバイルでの自動再生制限に対応するため、プレースホルダークリックをトリガーに `react-youtube` の Player API (`loadVideoById`) を使用する方式に変更。
- **データキー**: 当初 `id` フィールドを検討したが、`youtubeId` がユニークである前提とし、`id` フィールドを削除。コード全体で `youtubeId` をキーとして利用。
- **スタイリング**: Typography プラグインの問題回避のため、`/about` ページはユーティリティクラスによる直接スタイリングに変更。

