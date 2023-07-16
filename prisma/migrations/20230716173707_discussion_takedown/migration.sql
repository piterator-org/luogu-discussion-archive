-- CreateTable
CREATE TABLE "DiscussionTakedown" (
    "discussionId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "submitterId" INTEGER NOT NULL,

    CONSTRAINT "DiscussionTakedown_pkey" PRIMARY KEY ("discussionId")
);

-- AddForeignKey
ALTER TABLE "DiscussionTakedown" ADD CONSTRAINT "DiscussionTakedown_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionTakedown" ADD CONSTRAINT "DiscussionTakedown_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
