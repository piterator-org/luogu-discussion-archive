-- CreateTable
CREATE TABLE "Judgement" (
    "time" TIMESTAMP(0) NOT NULL,
    "userId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "permissionGranted" INTEGER NOT NULL,
    "permissionRevoked" INTEGER NOT NULL,

    CONSTRAINT "Judgement_pkey" PRIMARY KEY ("time","userId")
);

-- CreateIndex
CREATE INDEX "Judgement_time_idx" ON "Judgement"("time" DESC);

-- CreateIndex
CREATE INDEX "Judgement_userId_idx" ON "Judgement"("userId");

-- AddForeignKey
ALTER TABLE "Judgement" ADD CONSTRAINT "Judgement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
