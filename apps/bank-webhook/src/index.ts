import express from "express";
import { Request, Response } from "express";
import prisma from "@repo/db/client";
const app = express();

app.use(express.json())

app.post("/hdfcWebhook", async (req: Request, res: Response) => {
    //TODO: Add zod validation here?
    //TODO: HDFC bank should ideally send us a secret so we know this is sent by them

    console.log(req.body)
    const paymentInformation: {
        token: string;
        userId: string;
        amount: string
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };

    const fromUser = await prisma.onRampTransaction.findUnique({
        where: {
            token: paymentInformation.token
        }
    })

    if (!fromUser?.token || fromUser?.status !== "Processing") {
        res.status(400).json({
            error: "There's error on your paramaters"
        });
        return;
    }

    try {
        await prisma.$transaction(async (db) => {
            await db.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        // You can also get this from your DB
                        increment: Number(paymentInformation.amount) * 100
                    }
                }
            })

            await db.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                },
                data: {
                    status: "Success",
                }
            })
        })

        res.json({
            message: "Captured"
        })
    } catch (e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }
})

app.listen(3003);