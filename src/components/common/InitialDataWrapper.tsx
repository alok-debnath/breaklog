"use server";
import { preloadQuery } from "convex/nextjs";
import { cookies } from "next/headers";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import InitialRscFetch from "./InitialRscFetch";

function normalizeToken(value: string | undefined | null) {
  return value && value.trim().length > 0 ? value : null;
}

export default async function InitialDataWrapper() {
  try {
    // 1. Try server-side auth token
    const rawToken = null;
    const tokenFromAuth = normalizeToken(rawToken);

    let finalToken = tokenFromAuth;

    // 2. Only hit cookies if auth token is missing
    if (!finalToken) {
      const cookieStore = await cookies();
      finalToken = normalizeToken(
        cookieStore.get("__Secure-better-auth.convex_jwt")?.value ??
          cookieStore.get("better-auth.convex_jwt")?.value,
      );

      console.log(
        "Retrieved fallback token from cookies:",
        finalToken ? "Yes" : "No",
      );
    }

    // 3. If still no token → fallback to client-side
    if (!finalToken) {
      console.log(
        "User not authenticated, falling back to client-side rendering",
      );
      return <InitialRscFetch />;
    }

    // Preload the data server-side with proper authentication
    const preloadedLogs = await preloadQuery(
      api.user.fetchLogs.fetchLogs,
      {},
      { token: finalToken },
    );
    const preloadedProfile = await preloadQuery(
      api.user.profile.fetch,
      {},
      { token: finalToken },
    );

    console.log("Successfully preloaded data server-side");

    return (
      <InitialRscFetch
        preloadedLogs={preloadedLogs}
        preloadedProfile={preloadedProfile}
      />
    );
  } catch (error) {
    console.error("Error in server-side data loading:", error);

    // Fallback to client-side rendering if anything fails
    return <InitialRscFetch />;
  }
}
