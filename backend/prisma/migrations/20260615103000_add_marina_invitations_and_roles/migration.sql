ALTER TYPE "MarinaRole" RENAME VALUE 'ADMIN' TO 'MANAGER';
ALTER TYPE "MarinaRole" RENAME VALUE 'MEMBER' TO 'STAFF';

CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'CANCELLED');

CREATE TABLE "MarinaInvitation" (
    "id" TEXT NOT NULL,
    "marinaId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "MarinaRole" NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "invitedByUserId" TEXT NOT NULL,
    "acceptedByUserId" TEXT,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarinaInvitation_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MarinaInvitation_email_idx" ON "MarinaInvitation"("email");
CREATE INDEX "MarinaInvitation_marinaId_idx" ON "MarinaInvitation"("marinaId");

ALTER TABLE "MarinaInvitation" ADD CONSTRAINT "MarinaInvitation_marinaId_fkey" FOREIGN KEY ("marinaId") REFERENCES "Marina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MarinaInvitation" ADD CONSTRAINT "MarinaInvitation_invitedByUserId_fkey" FOREIGN KEY ("invitedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
