import { auth } from "@/server/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (session?.user) {
    return NextResponse.json(session.user, { status: 200 });
  }

  return NextResponse.json({ error: "UNAUTHORIZED_USER" }, { status: 401 });
}
