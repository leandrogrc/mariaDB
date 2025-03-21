import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const localUrl = request.url.replace("https", "http");
  const authenticatedUser = await fetch(new URL("/api/auth/me", localUrl), {
    headers: {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      /* eslint-disable @typescript-eslint/no-unsafe-assignment */
      Cookie: request.cookies as any,
    },
  });

  if (authenticatedUser.status !== 200) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/account/:path*"],
};
