import { db } from "@/db/db";
import { projects, tickets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    if (!id) {
      return NextResponse.redirect(
        new URL("/support/failed", process.env.BASE_URL).toString()
      );
    }

    const ticketRows = await db
      .select()
      .from(tickets)
      .where(eq(tickets.id, id));
    const ticket = ticketRows?.[0];

    if (!ticket) {
      return NextResponse.redirect(
        new URL("/support/failed", process.env.BASE_URL).toString()
      );
    }

    // If already confirmed, redirect to detail page
    if (ticket.confirmed) {
      const url = new URL(`/tickets/${id}`, process.env.BASE_URL);
      return NextResponse.redirect(url.toString());
    }

    // Check if the ticket was created within the last 2 hours
    if (dayjs(ticket.created_at).isAfter(dayjs().subtract(1, "hours"))) {
      const url = new URL("/support/success", process.env.BASE_URL);
      url.searchParams.set("ticket", ticket.id);

      await db
        .update(tickets)
        .set({ confirmed: true })
        .where(eq(tickets.id, id));

      if (!ticket.projectId)
        return NextResponse.redirect(
          new URL("/support/failed", process.env.BASE_URL).toString()
        );

      const project = await db
        .select()
        .from(projects)
        .where(eq(projects.id, ticket.projectId));

      const webhookURL = process.env.SLACK_WEBHOOK_URL;
      if (webhookURL) {
        await fetch(webhookURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: ticket.email,
            blocks: [
              {
                type: "header",
                text: {
                  type: "plain_text",
                  text: `New ticket from ${ticket.email} in project ${project[0].name}`,
                },
              },
              {
                type: "section",
                fields: [
                  {
                    type: "mrkdwn",
                    text: `*Summary:*\n${ticket.summary}`,
                  },
                  {
                    type: "mrkdwn",
                    text: `*Description:*\n${ticket.description}`,
                  },
                  {
                    type: "mrkdwn",
                    text: `*Type:*\n${ticket.type}`,
                  },
                ],
              },
              {
                type: "actions",
                elements: [
                  {
                    type: "button",
                    text: {
                      type: "plain_text",
                      text: "View ticket",
                    },
                    url: `${process.env.BASE_URL}/tickets/${ticket.id}`,
                  },
                ],
              },
            ],
          }),
        });
      }

      return NextResponse.redirect(url.toString());
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: e }, { status: 500 });
  }
}
