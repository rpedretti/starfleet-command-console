-- CreateEnum
CREATE TYPE "Race" AS ENUM ('HUMAN', 'VULCAN', 'ANDORIAN', 'KLINGON', 'BETAZOID', 'BOLIAN', 'TRILL', 'FERENGI', 'CARDASSIAN', 'ROMULAN');

-- CreateEnum
CREATE TYPE "ShipStatus" AS ENUM ('BUILDING', 'ACTIVE', 'IN_REPAIR', 'DECOMMISSIONED', 'DIA');

-- CreateEnum
CREATE TYPE "StarFleetShipClass" AS ENUM ('AKIRA', 'AMBASSADOR', 'ANTARES', 'CENTAUR', 'CHALLENGER', 'CONSTELLATION', 'CONSTITUTION', 'DANUBE', 'DEFIANT', 'ENCHELON', 'EXCELSIOR', 'GAGARIN', 'GALAXY', 'INQUIRY', 'INTREPID', 'LUNA', 'MIRANDA', 'NEBULA', 'NOVA', 'OBERTH', 'ODYSSEY', 'PATHFINDER', 'RELIANT', 'ROSS', 'SOVEREIGN');

-- CreateTable
CREATE TABLE "Ship" (
    "id" TEXT NOT NULL,
    "registry" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "class" "StarFleetShipClass" NOT NULL,
    "status" "ShipStatus" NOT NULL DEFAULT 'BUILDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Officer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "shipId" TEXT,
    "race" "Race" NOT NULL,

    CONSTRAINT "Officer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ship_registry_key" ON "Ship"("registry");

-- AddForeignKey
ALTER TABLE "Officer" ADD CONSTRAINT "Officer_shipId_fkey" FOREIGN KEY ("shipId") REFERENCES "Ship"("id") ON DELETE SET NULL ON UPDATE CASCADE;
