# SoulMate AI

AIを活用したカウンセリングチャットアプリケーション

## 機能

- 複数のテーマとアプローチに基づくカウンセリング
- ユーザープロフィール管理
- セッションごとのチャット履歴管理
- プロンプト使用回数のトラッキング

## 技術スタック

- React
- TypeScript
- Material-UI
- Supabase
- OpenAI API

## 開発環境のセットアップ

### 前提条件

- Node.js（v16以上）
- Git
- Supabaseアカウント
- OpenAI APIキー

### セットアップ手順

1. リポジトリのクローン

```bash
git clone https://github.com/nori9110/soulmate-ai-x.git
cd soulmate-ai-x
```

2. 依存パッケージのインストール

```bash
npm install
```

3. 環境変数の設定

- `.env.example`ファイルを`.env`にコピー

```bash
cp .env.example .env
```

- `.env`ファイルを編集し、必要な環境変数を設定：
  - `REACT_APP_SUPABASE_URL`: SupabaseプロジェクトのURL
  - `REACT_APP_SUPABASE_ANON_KEY`: Supabaseの匿名キー
  - `REACT_APP_OPENAI_API_KEY`: OpenAI APIキー

4. データベースのセットアップ
   Supabase管理画面で以下のSQLを実行：

```sql
-- プロフィールテーブルにprompt_countカラムを追加
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS prompt_count INTEGER DEFAULT 0;

-- プロンプトカウントを増やす関数を作成
CREATE OR REPLACE FUNCTION increment_prompt_count(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET prompt_count = COALESCE(prompt_count, 0) + 1
  WHERE id = user_id;
END;
$$;
```

5. アプリケーションの起動

```bash
npm start
```

アプリケーションは http://localhost:3000 で起動します。

## 開発ガイドライン

### ブランチ戦略

- `main`: 本番環境用の安定ブランチ
- `develop`: 開発用ブランチ
- 機能追加時: `feature/機能名`
- バグ修正時: `fix/バグ名`

### コミットメッセージ規約

- `feat:` 新機能
- `fix:` バグ修正
- `docs:` ドキュメント
- `style:` コードスタイル
- `refactor:` リファクタリング
- `test:` テスト
- `chore:` その他

### コードスタイル

- ESLintとPrettierの設定に従ってください
- コンポーネントはTypeScriptで実装してください
- Material-UIのコンポーネントを活用してください

## デプロイ

### Vercelを使用したデプロイ手順

1. Vercelアカウントの作成

   - [Vercel](https://vercel.com)にアクセス
   - 「Sign Up」をクリック
   - GitHubアカウントでサインアップを選択

2. プロジェクトのインポート

   - Vercelダッシュボードで「New Project」をクリック
   - 「Import Git Repository」セクションでsoulmate-ai-xリポジトリを選択
   - 必要に応じて「Import」をクリック

3. プロジェクトの設定

   - 「Framework Preset」が「Create React App」になっていることを確認
   - 「Environment Variables」セクションで以下の環境変数を設定：
     - `REACT_APP_SUPABASE_URL`
     - `REACT_APP_SUPABASE_ANON_KEY`
     - `REACT_APP_OPENAI_API_KEY`
   - 「Deploy」ボタンをクリック

4. デプロイ完了後の設定

   - 「Domains」タブでカスタムドメインを設定（任意）
   - 「Settings」→「Privacy」で「Protect Preview URLs」を有効化

5. 特定ユーザーへのアクセス権付与
   - 「Settings」→「Privacy」→「Add Email」で閲覧を許可するメールアドレスを追加
   - 追加したユーザーにVercelのプレビューURLを共有

### アクセス制限の管理

1. パスワード保護の設定

   - 「Settings」→「Privacy」→「Require Password」を有効化
   - パスワードを設定
   - パスワードを許可するユーザーに共有

2. アクセス権の管理
   - 「Team Members」でチームメンバーを追加/削除
   - 各メンバーの権限レベルを設定（Member/Owner）

### デプロイの更新

- mainブランチへの変更が自動的にデプロイされます
- デプロイの状況は「Deployments」タブで確認できます
- 必要に応じて「Redeploy」または「Roll back」が可能

### 注意事項

- 環境変数は適切に管理し、公開リポジトリには含めないでください
- アクセス権を付与するメールアドレスは慎重に管理してください
- 定期的にアクセス権限を見直すことをお勧めします

## トラブルシューティング

### よくある問題

1. 環境変数が認識されない

   - `.env`ファイルが正しい場所にあるか確認
   - 環境変数名が`REACT_APP_`で始まっているか確認

2. Supabaseとの接続エラー

   - 環境変数が正しく設定されているか確認
   - Supabaseプロジェクトの設定を確認

3. OpenAI APIエラー
   - APIキーが有効か確認
   - 使用量制限に達していないか確認

### サポート

問題が解決しない場合は、以下の手順で報告してください：

1. GitHubのIssuesセクションで新しいIssueを作成
2. 問題の詳細な説明を記載
3. 可能であればエラーメッセージやスクリーンショットを添付

## ライセンス

このプロジェクトは非公開です。権限のないユーザーによる使用、複製、配布は禁止されています。
