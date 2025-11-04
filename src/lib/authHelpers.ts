// lib/authHelpers.ts

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error("Environment variable NEXT_PUBLIC_CONVEX_URL is required");
}
const convex = new ConvexHttpClient(convexUrl);

export const getUserIdFromSession = async () => {
  try {
    const user = await convex.query(api.auth.getCurrentUser);
    if (!user) {
      const error = new Error("Unauthorized — invalid or expired session");
      error.name = "SessionError";
      throw error;
    }
    return user._id;
  } catch (error) {
    const e = new Error("Unauthorized — invalid or expired session");
    e.name = "SessionError";
    throw e;
  }
};
