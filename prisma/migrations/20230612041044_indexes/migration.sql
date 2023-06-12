-- CreateIndex
CREATE INDEX "Reply_discussionId_idx" ON "Reply"("discussionId");

-- CreateIndex
CREATE INDEX "Snapshot_discussionId_idx" ON "Snapshot"("discussionId");
