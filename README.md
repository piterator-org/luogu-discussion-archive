# luogu-discussion-archive

因洛谷于 9 月 7 日[升级了讨论区](https://www.luogu.com.cn/discuss/680426)，现已移除所有保存逻辑。

## 依赖

使用 pnpm 管理依赖

```bash
pnpm install
```

## 环境变量配置

```bash
export DATABASE_URL="postgresql://postgres@localhost:5432/luogu_discussion_archive?schema=public" # PostgreSQL 数据库地址，参见：https://pris.ly/d/postgres-connector
```

## 数据库迁移

使用 PostgreSQL 作为数据库。

```bash
pnpm exec prisma migrate deploy
```

## 开发

```bash
pnpm run dev
# 或直接
pnpm run dev
```

## 生产

```bash
pnpm run build # 构建
pnpm run start
```
