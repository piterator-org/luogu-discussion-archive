-- CreateIndex
CREATE INDEX "Judgement_userId_idx" ON "Judgement"("userId");

-- CreateIndex
CREATE INDEX "Paste_userId_idx" ON "Paste"("userId");

-- CreateIndex
CREATE INDEX "Reply_authorId_idx" ON "Reply"("authorId");

-- CreateIndex
CREATE INDEX "Snapshot_authorId_idx" ON "Snapshot"("authorId");
