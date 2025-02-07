"use client"
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export default function SendNotificationPage() {
    const [notificationSent, setNotificationSent] = useState(false);

    useEffect(() => {
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
                setNotificationSent(true);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        handleSlackRequest();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader className='text-center'>
                    <CardTitle> {notificationSent ? 'Notification sent' : 'Sending notification...'}</CardTitle>
                </CardHeader>
            </Card>
        </div>
    )
}