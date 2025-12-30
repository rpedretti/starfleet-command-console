/*
  Warnings:

  - Added the required column `role` to the `Officer` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `rank` on the `Officer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OfficerRank" AS ENUM ('ENSIGN', 'LIEUTENANT', 'LIEUTENANT_COMMANDER', 'COMMANDER', 'CAPTAIN', 'ADMIRAL');

-- CreateEnum
CREATE TYPE "OfficerRole" AS ENUM ('COMMAND', 'SCIENCE', 'ENGINEERING', 'MEDICAL', 'SECURITY', 'OPERATIONS', 'DIPLOMACY');

-- AlterTable
ALTER TABLE "Officer" ADD COLUMN     "role" "OfficerRole" NOT NULL,
DROP COLUMN "rank",
ADD COLUMN     "rank" "OfficerRank" NOT NULL;
