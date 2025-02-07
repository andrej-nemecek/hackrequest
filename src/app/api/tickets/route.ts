import { db } from "@/db/db";
import { tickets, users } from "@/db/schema";
import { ticketSchema } from "@/lib/schemas";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (!req.body)
      return NextResponse.json(
        { message: "No body provided" },
        { status: 400 }
      );
    const parsedBody = await req.json();
    const validatedData = ticketSchema.parse(parsedBody);

    // Find user by an email in DB
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email));

    // If user is found, add the new ticket into the user's tickets
    if (user.length > 0) {
      // Get the first one, as we only expect one user with the same email
      await db
        .insert(tickets)
        .values({ ...validatedData, clientId: user[0].id, status: "received" });
    }

    // TODO: Send an email to the user

    return NextResponse.json({ message: "Ticket received" }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: e }, { status: 500 });
  }
}
