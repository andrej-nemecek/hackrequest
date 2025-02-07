import { db } from "@/db/db";
import { projects, tickets, userProjects, users } from "@/db/schema";
import { ticketSchema } from "@/lib/schemas";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    if (!req.body)
      return NextResponse.json(
        { message: "No body provided" },
        { status: 400 }
      );
    const parsedBody = await req.json();
    const validatedData = ticketSchema.parse(parsedBody);

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
      const ticket = await db
        .insert(tickets)
        .values({
          ...validatedData,
          projectId: userProject[0].user_projects.projectId,
          status: "received",
        })
        .returning({
          id: tickets.id,
          summary: tickets.summary,
          description: tickets.description,
          type: tickets.type,
          projectId: tickets.projectId,
        });

      const transporter = nodemailer.createTransport({
        port: 587,
        host: process.env.SMTP_HOST,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      transporter.sendMail(
        {
          from: process.env.SMTP_SENDER,
          to: validatedData.email,
          subject: "Ticket received",
          html: `<p>Your ticket has been received. Please confirm your ticket clicking on the link below.</p><a href="${process.env.BASE_URL}/tickets/verify/${ticket[0].id}">Confirm ticket</a>`,
        },
        (err) => {
          if (err) console.log(err);
          else console.log("Email sent");
        }
      );
    }

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
      return NextResponse.json({ message: "No ID provided" }, { status: 400 });
    }

    const ticket = await db.select().from(tickets).where(eq(tickets.id, id));

    if (!ticket) {
      return NextResponse.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(ticket[0], { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: e }, { status: 500 });
  }
}
