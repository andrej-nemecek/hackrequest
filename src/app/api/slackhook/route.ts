import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    console.log(req)
    try {
        const webhookUrl = 'https://hooks.slack.com/services/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';
        

            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: 'AHA VRABO NOTIFIKACIA' }),
            });

            console.log(response)

            return NextResponse.json({ message: "Notification sent" }, { status: 201 });
    } catch (e) {
        return NextResponse.json({ message: e }, { status: 500 });
    }
}