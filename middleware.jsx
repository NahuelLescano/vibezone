import { AuthMiddleware } from "@clerk/nextjs";
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRouters: ['/api/webhook']
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};