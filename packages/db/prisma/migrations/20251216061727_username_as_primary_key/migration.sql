/*
  Warnings:

  - The primary key for the `developer_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `developer_tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `developer_tokens` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `developer_tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "developer_tokens" DROP CONSTRAINT "developer_tokens_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "developer_tokens_username_key" ON "developer_tokens"("username");

-- CreateIndex
CREATE UNIQUE INDEX "developer_tokens_token_key" ON "developer_tokens"("token");
