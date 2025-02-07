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
          email: tickets.email,
          summary: tickets.summary,
          description: tickets.description,
          type: tickets.type,
          projectId: tickets.projectId,
        });

      const project = await db
        .select()
        .from(projects)
        .where(eq(projects.id, validatedData.projectId));

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
          html: `<div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
                  <h2>Ticket received</h2>
                  <p>Hi ${ticket[0].email},</p>
                
                 <p>Thank you for reaching out to us! We’re happy to inform you that your support ticket has been successfully created.</p>
                 <p><strong>Ticket ID:</strong> ${ticket[0].id}</p>
                 <p><strong>Project:</strong> ${project[0].name}</p>
                 <p><strong>Summary:</strong> ${ticket[0].summary}</p>
                 <p><strong>Description:</strong> ${ticket[0].description}</p>
                 
           <div style="text-align: center">
          <p>
          Our team will be reviewing your request after your confirmation, and someone from our support team will get in touch with you shortly to assist further.
          Thank you for your patience, and we look forward to resolving your issue!</p>
          
          <a href="${process.env.BASE_URL}/tickets/verify/${ticket[0].id}" 
             style="background-color: #888; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">
             Confirm Ticket
        </a>
        </div>
        </div>`,
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
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
