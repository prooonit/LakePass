-- CreateEnum
CREATE TYPE "MarinaRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Marina" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Marina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarinaMember" (
    "id" TEXT NOT NULL,
    "marinaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "MarinaRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarinaMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Marina_slug_key" ON "Marina"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MarinaMember_marinaId_userId_key" ON "MarinaMember"("marinaId", "userId");

-- AddForeignKey
ALTER TABLE "MarinaMember" ADD CONSTRAINT "MarinaMember_marinaId_fkey" FOREIGN KEY ("marinaId") REFERENCES "Marina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarinaMember" ADD CONSTRAINT "MarinaMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
