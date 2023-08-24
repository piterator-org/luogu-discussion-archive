-- CreateEnum
CREATE TYPE "Color" AS ENUM ('Gray', 'Blue', 'Green', 'Orange', 'Red', 'Purple');

-- CreateTable
CREATE TABLE "Profile" (
    "uid" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slogan" TEXT,
    "badge" TEXT,
    "isAdmin" BOOLEAN NOT NULL,
    "isBanned" BOOLEAN NOT NULL,
    "color" "Color" NOT NULL,
    "ccfLevel" INTEGER NOT NULL,
    "background" TEXT NOT NULL,
    "isRoot" BOOLEAN,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("uid")
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

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
