-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'prefernottosay');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('general', 'obc', 'sc', 'st');

-- CreateEnum
CREATE TYPE "YesNo" AS ENUM ('yes', 'no');

-- CreateTable
CREATE TABLE "Registration" (
    "id" SERIAL NOT NULL,
    "applicantName" TEXT NOT NULL,
    "scheme" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(10) NOT NULL,
    "postalAddress" TEXT NOT NULL,
    "DOB" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "category" "Category" NOT NULL,
    "education" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "resume" TEXT NOT NULL,
    "ideaDescription" TEXT NOT NULL,
    "conceptNote" TEXT NOT NULL,
    "aspectNote" TEXT NOT NULL,
    "previousRecipient" "YesNo" NOT NULL,
    "fullCommitment" "YesNo" NOT NULL,
    "noOtherFellowship" "YesNo" NOT NULL,
    "businessCommitment" "YesNo" NOT NULL,
    "noBeneficiary" "YesNo" NOT NULL,
    "registerPEP" "YesNo" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Registration_email_key" ON "Registration"("email");
