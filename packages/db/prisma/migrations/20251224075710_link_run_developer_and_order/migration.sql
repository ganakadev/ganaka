/*
  Warnings:

  - You are about to drop the `developer_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "runs" ADD COLUMN     "developerId" TEXT;

-- DropTable
DROP TABLE "developer_tokens";

-- CreateTable
CREATE TABLE "developers" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "developers_pkey" PRIMARY KEY ("username")
);

-- CreateIndex
CREATE UNIQUE INDEX "developers_id_key" ON "developers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "developers_username_key" ON "developers"("username");

-- CreateIndex
CREATE UNIQUE INDEX "developers_token_key" ON "developers"("token");

-- CreateIndex
CREATE INDEX "developers_token_username_idx" ON "developers"("token", "username");

-- AddForeignKey
ALTER TABLE "runs" ADD CONSTRAINT "runs_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "developers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
