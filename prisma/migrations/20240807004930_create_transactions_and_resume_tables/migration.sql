-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions_resume" (
    "id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "total_non_processed" TEXT NOT NULL,

    CONSTRAINT "transactions_resume_pkey" PRIMARY KEY ("id")
);
