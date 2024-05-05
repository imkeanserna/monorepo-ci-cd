"use client";

import { Card } from "@repo/ui/card"
import { DefaultSession } from "next-auth";
import { useSession } from "next-auth/react"

export const OnRampSendMoney = ({ transactions }: {
    transactions: {
        amount: number,
        startTime: Date,
        toUserId: number,
        fromUserId: number
    }[]
}) => {
    const session = useSession();

    return <Card title="Recent Transactions">
        {transactions.length === 0
            ?
            <div>
                No recent transaction
            </div>
            :
            <div>
                {transactions.map((value, key) => {
                        return <div key={key} className="flex justify-between">
                            {value.toUserId !== Number(session.data?.user.id)
                                ?
                                <>
                                    <div>
                                        <p>Deducted INR</p>
                                        <p>{value.startTime.toDateString()}</p>
                                    </div>
                                    <div>
                                        - Rs {value.amount / 100}
                                    </div>
                                </>
                                : <>
                                    <div>
                                        <p>Received INR</p>
                                        <p>{value.startTime.toDateString()}</p>
                                    </div>
                                    <div>
                                        + Rs {value.amount / 100}
                                    </div>
                                </>
                            }
                        </div>
                    }
                )}
            </div>
        }
    </Card>
}