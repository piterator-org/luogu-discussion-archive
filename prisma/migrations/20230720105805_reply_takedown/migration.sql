-- CreateTable
CREATE TABLE "ReplyTakedown" (
    "replyId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "submitterId" INTEGER NOT NULL,

    CONSTRAINT "ReplyTakedown_pkey" PRIMARY KEY ("replyId")
);

-- AddForeignKey
ALTER TABLE "ReplyTakedown" ADD CONSTRAINT "ReplyTakedown_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Reply"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplyTakedown" ADD CONSTRAINT "ReplyTakedown_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
