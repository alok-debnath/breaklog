"use server";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import InitialRscFetch from "./InitialRscFetch";

export default async function InitialDataWrapper() {
  try {
    const token = await getToken();

    if (!token) {
      console.log(
        "User not authenticated, falling back to client-side rendering",
      );
      return <InitialRscFetch />;
    }

    // Preload the data server-side with proper authentication
    const preloadedLogs = await preloadQuery(
      api.user.fetchLogs.fetchLogs,
      {},
      { token },
    );
    const preloadedProfile = await preloadQuery(
      api.user.profile.fetch,
      {},
      { token },
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
