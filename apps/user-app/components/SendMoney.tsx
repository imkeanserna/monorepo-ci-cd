"use client";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card"
import { TextInput } from "@repo/ui/textinput"
import { useState } from "react"
import { sendMoneyTransaction } from "../app/lib/actions/sendMoney";

export const SendMoney = () => {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState(0);
    return <Card title="Send">
        <TextInput placeholder="1234" label="Number" onChange={(value) => {
            setNumber(value);
        }}/>
        <TextInput placeholder="100" label="Amount" onChange={(value) => {
            setAmount(Number(value))
        }}/>
        <div>
            <Button onClick={ async () => {
                await sendMoneyTransaction(number, amount * 100)
            }}>Send</Button>
        </div>
    </Card>
}