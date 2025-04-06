import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in", "/sign-up","/"]);

const isPublicApiRoute = createRouteMatcher(["/api/videos"]);

export default clerkMiddleware(async(auth, req) => {
  const { userId } = await auth();
  const pathname = new URL(req.url).pathname;

  if (userId && isPublicRoute(req) && pathname!=='/gallery' ) {
    return NextResponse.redirect(new URL("/gallery", req.url));
  }

  if (!userId && !isPublicRoute(req) && !isPublicApiRoute(req) || !userId && pathname==="/") {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }


  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
