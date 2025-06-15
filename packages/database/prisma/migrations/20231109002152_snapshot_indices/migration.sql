-- CreateIndex
CREATE INDEX "PasteSnapshot_pasteId_time_idx" ON "PasteSnapshot"("pasteId", "time" DESC);

-- CreateIndex
CREATE INDEX "PostSnapshot_postId_time_idx" ON "PostSnapshot"("postId", "time" DESC);

-- CreateIndex
CREATE INDEX "ReplySnapshot_replyId_time_idx" ON "ReplySnapshot"("replyId", "time" DESC);

-- CreateIndex
CREATE INDEX "UserSnapshot_userId_time_idx" ON "UserSnapshot"("userId", "time" DESC);
