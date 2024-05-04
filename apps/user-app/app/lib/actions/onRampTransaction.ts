"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export const onRampTransaction = async (amount: number, provider: string) => {
    const token = JSON.stringify(Math.random());
    const session = await getServerSession(authOptions);

    if (!session.user && !session.user.id) {
        return { error: "Unauthorized" }
    }

    const fromUserAmount: any = prisma.balance.findUnique({
        where: {
            userId: Number(session.user.id)
        },
        select: {
            amount: true
        }
    });

    if (fromUserAmount.amount < amount || amount <= 0) {
        return { error: "You have insufficient balance" }
    }

    await prisma.onRampTransaction.create({
        data: {
            token,
            status: "Processing",
            provider: provider,
            amount: amount * 100,
            startTime: new Date,
            userId: Number(session.user.id)
        }
    });

    return {
        message: "done"
    }
}