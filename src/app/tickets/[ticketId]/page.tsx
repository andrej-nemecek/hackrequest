import React from "react";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { db } from "@/db/db";
import { tickets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { validate as isValidUUID } from "uuid";

export default async function TicketDetailPage({
  params,
}: {
  params: { ticketId: string };
}) {
  const { ticketId } = await params;

  const valid = isValidUUID(ticketId);

  const ticket = valid
    ? await db.select().from(tickets).where(eq(tickets.id, ticketId))
    : null;

  if (ticket && ticket.length !== 0)
    return (
      <div className="container mx-auto p-4 h-[100vh] flex flex-col justify-center">
        <Card className="max-w-2xl mx-auto min-w-[50%] shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle>Support ticket</CardTitle>
            <CardDescription>
              View the details of the support ticket.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-gray-50 rounded-b-lg space-y-4">
            <div>
              <Label className="text-gray-700 font-semibold">Summary</Label>
              <p className="text-gray-900 p-2 bg-white rounded-md shadow-sm">{ticket[0].summary}</p>
            </div>
            <div>
              <Label className="text-gray-700 font-semibold">Description</Label>
              <p className="text-gray-900 p-2 bg-white rounded-md shadow-sm">{ticket[0].description}</p>
            </div>
            <div>
              <Label className="text-gray-700 font-semibold">Type</Label>
              <p className="text-gray-900 p-2 bg-white rounded-md shadow-sm">{ticket[0].type}</p>
            </div>
            <div>
              <Label className="text-gray-700 font-semibold">Status</Label>
              <p className="text-gray-900 p-2 bg-white rounded-md shadow-sm">{ticket[0].status}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="container mx-auto p-4 h-[100vh] flex flex-col justify-center">
      <Card className="max-w-2xl mx-auto min-w-[50%] shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Support ticket not found</CardTitle>
          <CardDescription>
            Contact support if you believe this is an error.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
