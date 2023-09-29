-- CreateEnum
CREATE TYPE "Color" AS ENUM ('Cheater', 'Gray', 'Blue', 'Green', 'Orange', 'Red', 'Purple');

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Forum" (
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Forum_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL,
    "time" TIMESTAMP(0) NOT NULL,
    "replyCount" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reply" (
    "id" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "time" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "Reply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,
    "time" TIMESTAMP(0) NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paste" (
    "id" CHAR(8) NOT NULL,
    "time" TIMESTAMP(0) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Paste_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Judgement" (
    "time" TIMESTAMP(0) NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Judgement_pkey" PRIMARY KEY ("time","userId")
);

-- CreateTable
CREATE TABLE "UserSnapshot" (
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "badge" TEXT,
    "isAdmin" BOOLEAN NOT NULL,
    "isBanned" BOOLEAN NOT NULL,
    "isRoot" BOOLEAN,
    "color" "Color" NOT NULL,
    "ccfLevel" INTEGER NOT NULL,
    "until" TIMESTAMP(3) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSnapshot_pkey" PRIMARY KEY ("userId","time")
);

-- CreateTable
CREATE TABLE "PostSnapshot" (
    "postId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "until" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "forumSlug" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "PostSnapshot_pkey" PRIMARY KEY ("postId","time")
);

-- CreateTable
CREATE TABLE "ReplySnapshot" (
    "replyId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "until" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "ReplySnapshot_pkey" PRIMARY KEY ("replyId","time")
);

-- CreateTable
CREATE TABLE "PasteSnapshot" (
    "pasteId" CHAR(8) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "until" TIMESTAMP(3) NOT NULL,
    "public" BOOLEAN NOT NULL,
    "data" TEXT,

    CONSTRAINT "PasteSnapshot_pkey" PRIMARY KEY ("pasteId","time")
);

-- CreateTable
CREATE TABLE "PostTakedown" (
    "postId" INTEGER NOT NULL,
    "submitterId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "PostTakedown_pkey" PRIMARY KEY ("postId")
);

-- CreateTable
CREATE TABLE "ReplyTakedown" (
    "replyId" INTEGER NOT NULL,
    "submitterId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "ReplyTakedown_pkey" PRIMARY KEY ("replyId")
);

-- CreateTable
CREATE TABLE "ActivityTakedown" (
    "activityId" INTEGER NOT NULL,
    "submitterId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "ActivityTakedown_pkey" PRIMARY KEY ("activityId")
);

-- CreateIndex
CREATE INDEX "Reply_postId_idx" ON "Reply"("postId");

-- CreateIndex
CREATE INDEX "Paste_userId_idx" ON "Paste"("userId");

-- CreateIndex
CREATE INDEX "Judgement_time_idx" ON "Judgement"("time" DESC);

-- CreateIndex
CREATE INDEX "Judgement_userId_idx" ON "Judgement"("userId");

-- CreateIndex
CREATE INDEX "UserSnapshot_userId_idx" ON "UserSnapshot"("userId");

-- CreateIndex
CREATE INDEX "PostSnapshot_postId_idx" ON "PostSnapshot"("postId");

-- CreateIndex
CREATE INDEX "PostSnapshot_authorId_idx" ON "PostSnapshot"("authorId");

-- CreateIndex
CREATE INDEX "ReplySnapshot_replyId_idx" ON "ReplySnapshot"("replyId");

-- CreateIndex
CREATE INDEX "ReplySnapshot_authorId_idx" ON "ReplySnapshot"("authorId");

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paste" ADD CONSTRAINT "Paste_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Judgement" ADD CONSTRAINT "Judgement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSnapshot" ADD CONSTRAINT "UserSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostSnapshot" ADD CONSTRAINT "PostSnapshot_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostSnapshot" ADD CONSTRAINT "PostSnapshot_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostSnapshot" ADD CONSTRAINT "PostSnapshot_forumSlug_fkey" FOREIGN KEY ("forumSlug") REFERENCES "Forum"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplySnapshot" ADD CONSTRAINT "ReplySnapshot_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Reply"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplySnapshot" ADD CONSTRAINT "ReplySnapshot_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasteSnapshot" ADD CONSTRAINT "PasteSnapshot_pasteId_fkey" FOREIGN KEY ("pasteId") REFERENCES "Paste"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostTakedown" ADD CONSTRAINT "PostTakedown_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostTakedown" ADD CONSTRAINT "PostTakedown_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplyTakedown" ADD CONSTRAINT "ReplyTakedown_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Reply"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplyTakedown" ADD CONSTRAINT "ReplyTakedown_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityTakedown" ADD CONSTRAINT "ActivityTakedown_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityTakedown" ADD CONSTRAINT "ActivityTakedown_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
