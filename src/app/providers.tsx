"use client";

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

interface ProvidersProps {
  children: ReactNode;
  session?: Session | null;
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error("Environment variable NEXT_PUBLIC_CONVEX_URL is required");
}
const convex = new ConvexReactClient(convexUrl, {
  // Optionally pause queries until the user is authenticated
  expectAuth: true,
});

export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <ConvexBetterAuthProvider client={convex} authClient={authClient}>
        {children}
      </ConvexBetterAuthProvider>
    </SessionProvider>
  );
}
