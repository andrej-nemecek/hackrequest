"use client"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SendNotificationPage() {
    const handleSlackRequest = async () => {
        try {
            const response = await fetch('/api/slackhook', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: 'AHA VRABO NOTIFIKACIA' }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Success:', result);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Send Notification</CardTitle>
                    <CardDescription>Click the button below to send a notification.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button type="button" className="w-full" onClick={handleSlackRequest}>
                        Send
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}