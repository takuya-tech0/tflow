# タレントフロー Web アプリケーション

このアプリケーションは、FastAPIをバックエンド、Next.jsをフロントエンドに使用したフルスタックWebアプリケーションです。ユーザー認証、AIを用いた求人推薦、ユーザープロファイル管理などの機能を提供します。

## はじめに
以下の手順に従って、このアプリケーションをローカル環境でセットアップして起動してください。

## 前提条件
- Python 3.8以上
- Node.js 14.x以上

## プロジェクト構成
このプロジェクトは以下のように構成されています：


```plaintext
/talent-flow
│
├── /fastapi-backend   # バックエンド（FastAPI）ディレクトリ
│   ├── auth.py        # ユーザー認証関連の機能
│   ├── database.py    # データベース接続設定
│   ├── main.py        # FastAPIのメインエントリーポイント
│   ├── models.py      # SQLAlchemyのモデル定義
│   ├── schemas.py     # Pydanticのスキーマ定義
│   └── utils.py       # ユーティリティ関数
│
└── /nextjs-frontend   # フロントエンド（Next.js）ディレクトリ
    ├── pages          # 各ページのコンポーネント
    │   ├── index.js   # ログインページ
    │   ├── dashboard.js # ダッシュボードページ
    │   ├── job_recommendation.js # 求人推薦ページ
    │   └── mypage.js  # マイページ
    └── styles         # スタイルシート
```


## バックエンドのセットアップ
1.依存関係のインストール:<br>
cd /path/to/talent-flow/fastapi-backend<br>
pip install -r requirements.txt<br>
<br>
2.サーバーの起動:<br>
uvicorn main:app --reload<br>
サーバーは http://localhost:8000 で起動します。<br>
<br>
## フロントエンドのセットアップ<br>
1.依存関係のインストール:<br>
cd /path/to/talent-flow/nextjs-frontend<br>
npm install<br>
<br>
2.開発サーバーの起動:<br>
npm run dev<br>
サーバーは http://localhost:3000 で起動します。<br>
3.アプリケーションの起動<br>
上記の手順でバックエンドとフロントエンドのサーバーをそれぞれ起動した後、http://localhost:3000 にアクセスしてアプリケーションを利用できます。<br>

## トラブルシューティング<br>
依存関係のインストールに失敗する場合:<br>
python --version<br>
node --version<br>
PythonやNode.jsのバージョンが適切か確認し、pipやnpmのコマンドが正しく実行されているかを確認してください。<br>

サーバーが起動しない場合:<br>
lsof -i :8000<br>
lsof -i :3000<br>
ポートが他のプロセスで使用されていないかを確認し、必要に応じて設定ファイルやポートの競合をチェックしてください。<br>
