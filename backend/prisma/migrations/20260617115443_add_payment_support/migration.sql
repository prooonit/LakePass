-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- DropIndex
DROP INDEX "Booking_boatId_idx";

-- DropIndex
DROP INDEX "Booking_endTime_idx";

-- DropIndex
DROP INDEX "Booking_startTime_idx";

-- DropIndex
DROP INDEX "Booking_userId_idx";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "stripePaymentIntentId" TEXT,
ADD COLUMN     "stripeSessionId" TEXT;
