"use server";
import { getServerSession } from "next-auth"
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export const sendMoneyTransaction = async (toUserId: string, amount: number) => {
    const session = await getServerSession(authOptions);
    const fromUser = session?.user?.id;

    if (!session.user || !fromUser) {
        return { error: "Unauthorized" }
    }

    try {
        await prisma.$transaction(async (db) => {
            await db.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(fromUser)} FOR UPDATE`;

            const fromUserBalance = await db.balance.findUnique({
                where: {
                    id: Number(fromUser)
                }
            });
            if((fromUserBalance?.amount || 0) < amount) {
                throw new Error("You have insufficient balance")
            }

            await db.balance.update({
                where: {
                    id: Number(fromUser)
                },
                data: {
                    amount: {
                        decrement: amount
                    }
                }
            });

            await db.balance.update({
                where: {
                    id: Number(toUserId)
                },
                data: {
                    amount: {
                        increment: amount
                    }
                }
            })

            await db.sendTransaction.create({
                data: {
                    amount: amount,
                    startTime: new Date(),
                    toUserId: Number(toUserId),
                    fromUserId: Number(fromUser)
                }
            })
        })

        return {
            message: "You successfully transfer"
        }
    } catch(error: any) {
        console.error(error)
        return {
            error: "Something wrong in the backend"
        }
    }
}