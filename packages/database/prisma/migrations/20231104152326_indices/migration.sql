-- CreateIndex
CREATE INDEX "Post_time_idx" ON "Post"("time");

-- CreateIndex
CREATE INDEX "Post_replyCount_idx" ON "Post"("replyCount" DESC);

-- CreateIndex
CREATE INDEX "Reply_time_idx" ON "Reply"("time");
