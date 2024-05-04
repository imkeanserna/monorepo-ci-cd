-- CreateTable
CREATE TABLE "SendTransaction" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "toUser" INTEGER NOT NULL,
    "fromUser" INTEGER NOT NULL,

    CONSTRAINT "SendTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SendTransaction" ADD CONSTRAINT "SendTransaction_toUser_fkey" FOREIGN KEY ("toUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SendTransaction" ADD CONSTRAINT "SendTransaction_fromUser_fkey" FOREIGN KEY ("fromUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
