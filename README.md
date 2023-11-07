# luogu-discussion-archive

## 依赖

使用 pnpm 管理依赖

```bash
pnpm install
```

## 构建

```bash
pnpm -r run build
```

## 数据库

使用 PostgreSQL 作为数据库。

```bash
export DATABASE_URL="postgresql://postgres@localhost:5432/luogu_discussion_archive?schema=public" # PostgreSQL 数据库地址，参见：https://pris.ly/d/postgres-connector
pnpm exec prisma migrate deploy
```

## archive

```bash
# 配置环境变量
export PORT="3001" # 存档 API 服务监听的端口
export DATABASE_URL="postgresql://localhost/luogu_discussion_archive" # PostgreSQL 数据库地址
export VIEWER_HOST="https://lglg.top" # viewer 调用 API 的 Origin 头，作 CORS 校验之用

# 执行
node ./packages/archive/dist/server.js
```

## viewer

### 配置

在 `packages/viewer/.env.local` 中：

```bash
PORT="3000" # viewer 监听的端口
DATABASE_URL="postgresql://localhost/luogu_discussion_archive" # PostgreSQL 数据库地址
COOKIE="__client_id=ffffffffffffffffffffffffffffffffffffffff; _uid=0" # 请求洛谷的 Cookie 头
NEXT_PUBLIC_ARCHIVE_HOST="//lda.piterator.com" # 指向存档 API 服务器的相对地址
```

### 开发

```bash
cd packages/viewer
pnpm run dev
# 或直接
pnpm --filter viewer run dev
```

### 生产

```bash
node ./packages/viewer/.next/standalone/packages/viewer/server.js
```
