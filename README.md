# データベース変更ガイド

このプロジェクトでは、Prismaを使用してデータベーススキーマを管理しています。以下は、データベース構造を変更する際の手順です。

## 1. Prismaスキーマの変更

1. `prisma/schema.prisma` ファイルを開きます。
2. 必要な変更を加えます（新しいモデルの追加、既存のモデルの変更など）。

例：新しい制御マスタとその詳細を追加する場合

```prisma
model Control {
    id          Int             @id @default(autoincrement())
    name        String          @unique
    details     ControlDetail[]
    createdAt   DateTime        @default(now())
    updatedAt   DateTime        @updatedAt

    @@index([name])
}

model ControlDetail {
    id        Int      @id @default(autoincrement())
    code      String
    name      String
    controlId Int
    control   Control  @relation(fields: [controlId], references: [id])
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    @@unique([controlId, code])
    @@index([code])
    @@index([name])
}
```

## 2. マイグレーションの作成

変更を適用するためのマイグレーションを作成します：

```bash
npx prisma migrate dev --name add_control_models
```

このコマンドは以下の操作を行います：

- 新しいマイグレーションファイルを作成
- そのマイグレーションをデータベースに適用
- Prisma Clientを再生成

## 3. マイグレーションの確認

生成されたマイグレーションファイル（`prisma/migrations/[timestamp]_add_control_models/migration.sql`）を確認し、必要に応じて編集します。

## 4. Prisma Clientの更新

マイグレーション後、Prisma Clientを手動で更新する必要がある場合：

```bash
npx prisma generate
```

## 5. 変更のコミットとプッシュ

1. 変更したPrismaスキーマファイルをコミットします。
2. 新しく作成されたマイグレーションファイルもコミットします。
3. 変更をリモートリポジトリにプッシュします。

## 注意点

- 本番環境でのマイグレーション実行は慎重に行ってください。
- 大規模な変更の場合は、事前にステージング環境でテストすることを推奨します。
- チーム内で変更を共有し、他の開発者に通知してください。

## トラブルシューティング

マイグレーションに問題がある場合：

1. `npx prisma migrate reset` を使用してデータベースをリセットできます（開発環境のみ）。
2. マイグレーションの履歴に問題がある場合は、`prisma/migrations` ディレクトリ内のファイルを確認・編集してください。

詳細については、[Prisma公式ドキュメント](https://www.prisma.io/docs/concepts/components/prisma-migrate)を参照してください。

## ローカルデータベースの確認

開発中やトラブルシューティングの際に、ローカルデータベースの内容を直接確認することが有用です。以下の手順で psql を使用してデータベースに接続し、内容を確認できます。

### データベースへの接続

次のコマンドを使用してデータベースに接続します：

```bash
psql -h localhost -p 5432 -U postgres -d sample-1
```

ここで：

- `-h localhost`: ホスト名（ローカルの場合は localhost）
- `-p 5432`: ポート番号（PostgreSQLのデフォルトは 5432）
- `-U postgres`: ユーザー名（環境に応じて変更してください）
- `-d sample-1`: データベース名（プロジェクトに応じて変更してください）

### 基本的なSQLコマンド

接続後、以下のSQLコマンドを使用してデータベースの内容を確認できます：

1. テーブル一覧の表示:

   ```sql
   \dt
   ```

2. 特定のテーブルの構造確認:

   ```sql
   \d tablename
   ```

   例: `\d Control`

3. テーブルの内容確認:

   ```sql
   SELECT * FROM tablename;
   ```

   例: `SELECT * FROM Control;`

4. 条件付きクエリ:

   ```sql
   SELECT * FROM ControlDetail WHERE controlId = 1;
   ```

5. psqlセッションの終了:
   ```
   \q
   ```

### 注意点

- パスワードが設定されている場合、接続時にパスワードの入力を求められます。
- 本番データベースへの直接接続は避け、必ず開発環境またはステージング環境で作業してください。
- データベースの内容を変更する前に、必ずバックアップを取ることをお勧めします。

### 前提条件

- PostgreSQLがローカルにインストールされていること
- psqlコマンドラインツールが利用可能であること
- 適切なデータベースアクセス権限が設定されていること

詳細なpsqlの使用方法については、[PostgreSQL公式ドキュメント](https://www.postgresql.org/docs/current/app-psql.html)を参照してください。
