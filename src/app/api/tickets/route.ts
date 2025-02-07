import { db } from "@/db/db";
import { projects, tickets, userProjects, users } from "@/db/schema";
import { ticketSchema } from "@/lib/schemas";
import { and, eq } from "drizzle-orm";
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
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, validatedData.projectId));

    // Find user by email and check if they are connected to the provided projectId
    const userProject = await db
      .select()
      .from(userProjects)
      .innerJoin(users, eq(userProjects.userId, users.id))
      .innerJoin(projects, eq(userProjects.projectId, projects.id))
      .where(
        and(
          eq(users.email, validatedData.email),
          eq(projects.id, validatedData.projectId)
        )
      );

    // If user is found, add the new ticket into the user's tickets
    if (userProject.length > 0) {
      // Get the first one, as we only expect one user with the same email
      await db.insert(tickets).values({
        ...validatedData,
        projectId: userProject[0].user_projects.projectId,
        status: "received",
      });
    }

    // TODO: Send an email to the user

    return NextResponse.json({ message: "Ticket received" }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: e }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "No ID provided" },
        { status: 400 }
      );
    }

    const ticket = await db
      .select()
      .from(tickets)
      .where(eq(tickets.id, id));

    if (!ticket) {
      return NextResponse.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(ticket[0], { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}