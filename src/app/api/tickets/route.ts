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
      await db.insert(tickets).values({
        ...validatedData,
        projectId: userProject[0].user_projects.projectId,
        status: "received",
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
          from: "andrej.nemecek@goodrequest.com",
          to: validatedData.email,
          subject: "Ticket received",
          text: "Your ticket has been received",
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
