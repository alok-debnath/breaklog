import { preloadQuery } from "convex/nextjs";
import { getConvexToken, isAuthenticated } from "@/lib/auth-server";
import { api } from "../../../convex/_generated/api";
import InitialRscFetch from "./InitialRscFetch";

export default async function InitialDataWrapper() {
  try {
    // Check if user is authenticated
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      console.log(
        "User not authenticated, falling back to client-side rendering",
      );
      return <InitialRscFetch />;
    }

    // Get the proper Convex token from Better Auth
    const token = await getConvexToken();

    if (!token) {
      console.log(
        "Could not get Convex token, falling back to client-side rendering",
      );
      return <InitialRscFetch />;
    }

    // Preload the data server-side with proper authentication
    const preloadedLogs = await preloadQuery(
      api.fetchLogs.fetchLogs,
      {},
      { token },
    );
    const preloadedProfile = await preloadQuery(
      api.fetchProfile.fetchProfile,
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
