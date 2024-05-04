import { getServerSession } from "next-auth";
import { BalanceCard } from "../../../components/BalanceCard";
import { SendMoney } from "../../../components/SendMoney";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { OnRampSendMoney } from "../../../components/OnRampSendMoney";

const getBalance = async () => {
    const session = await getServerSession(authOptions);

    const balance = await prisma.balance.findUnique({
        where: {
            id: Number(session.user.id)
        },
        select: {
            amount: true,
            locked: true,
        }
    })
    return balance;
}

const getSendTransaction = async () => {
    const session = await getServerSession(authOptions);

    const transaction = await prisma.sendTransaction.findMany({
        where: {
            OR: [
                { toUser: Number(session.user.id) },
                { fromUser: Number(session.user.id) }
            ]
        },
        select: {
            amount: true,
            startTime: true,
            toUser: true,
            fromUser: true
        }
    })
    return transaction;
}

export default async function () {
    const balance = await getBalance();
    const transactions = await getSendTransaction();

    return <div className="flex">
        <div>
            <SendMoney />
        </div>
        <div className="flex">
            <div>
                <BalanceCard amount={balance?.amount || 0} locked={balance?.locked || 0} />
            </div>
            <div className="w-[500px]">
                <OnRampSendMoney transactions={transactions} />
            </div>
        </div>
    </div>
}