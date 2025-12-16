-- CreateTable
CREATE TABLE "developer_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "developer_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "developer_tokens_token_idx" ON "developer_tokens"("token");
