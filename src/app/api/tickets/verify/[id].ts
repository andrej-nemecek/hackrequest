import { db } from "@/db/db";
import { tickets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.redirect(
        new URL("/support/failed", process.env.BASE_URL).toString()
      );
    }

    const ticket = await db.select().from(tickets).where(eq(tickets.id, id));

    if (!ticket) {
      return NextResponse.redirect(
        new URL("/support/failed", process.env.BASE_URL).toString()
      );
    }

    console.log(ticket);

    return NextResponse.redirect("/support/success");
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: e }, { status: 500 });
  }
}
