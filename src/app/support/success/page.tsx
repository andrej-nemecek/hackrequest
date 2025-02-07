import { CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/db/db";
import { tickets } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function VerificationSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<void>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const param = await params;
  const searchParam = await searchParams;
  console.log(param);
  console.log(searchParam);

  const ticketId = String(searchParam.ticket);

  const filteredTickets = await db
    .select()
    .from(tickets)
    .where(eq(tickets.id, ticketId));

  const ticket = filteredTickets[0];

  return (
    <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
      <Card className="max-w-xl w-full">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-center text-2xl">
            Verification Successful
          </CardTitle>
          <CardDescription className="text-center">
            Your support request has been verified and submitted successfully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Submitted Request Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="font-semibold">Request Type:</dt>
                  <dd>{ticket.type}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Summary:</dt>
                  <dd>{ticket.summary}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Description:</dt>
                  <dd className="whitespace-pre-wrap">{ticket.description}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
