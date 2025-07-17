## 概要

自分のデイリーレポート（業務日報）を管理できるアプリケーションです。
Firebase 認証を利用し、各自のレポートを作成・編集・削除できます。

## 技術構成

- Frontend: Next.js (TypeScript)
- Backend: FastAPI (Python)
- DB: PostgreSQL (Docker)
- ORM: SQLAlchemy
- 認証: Firebase Authentication
- その他: ESLint / Prettier

## ディレクディレクトリ構成

```
project-root/
├── frontend/              ← フロントエンド（Next.jsなど）
├── backend/               ← バックエンド（FastAPIなど）
├── docs/                  ← 設計書・ドキュメント置き場
│   └── [architecture.md]  ← アーキテクチャ設計書（ER図、API仕様など）
├── [README.md]            ← プロジェクトの概要・起動方法をまとめた説明書
└── ...                    ← その他（環境構成ファイル、Dockerなど）
```

## 依存パッケージのインストール手順

- フロントエンド（Next.js）

```
cd frontend
npm install
```

- バックエンド（FastAPI）

```
cd ../backend
uv pip install -r requirements.txt
```

- PostgreSQL（DB）を起動（Docker）

※ docker-compose.yml  があるディレクトリで実行してください

```
cd ../db
docker-compose up -d
```

- Python 仮想環境のセットアップ

```
cd Backend
pyenv local 3.11.4
uv venv
source .venv/bin/activate
```

(ターミナルの先頭に (Backend) や (.venv) と表示されれば成功です)

- Python の依存パッケージ

※Backend ディレクトリで、仮想環境を有効にした後に以下を実行します。

```
uv pip install -r requirements.txt
```

- データベースのマイグレーション

Backend ディレクトリで、仮想環境が有効な状態で実行

```
alembic upgrade head
```

### アプリを起動する

フロントエンド

```
cd frontend
npm run dev
```

バックエンド


※Backend ディレクトリで、仮想環境を有効にした後に以下を実行します。

```
uvicorn main:app --reload --host 0.0.0.0 --port 3004
```

---
