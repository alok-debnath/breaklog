import { cookies } from "next/headers";

// Helper function to get the Convex auth token server-side using Better Auth
export const getConvexToken = async () => {
  const cookieStore = await cookies();
  
  // Get the session cookie - Better Auth typically uses 'better-auth.session_token'
  const sessionCookie = cookieStore.get("better-auth.session_token");
  
  if (!sessionCookie?.value) {
    return null;
  }

  try {
    // Use the Better Auth Convex token endpoint
    const baseUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/auth/convex/token`, {
      headers: {
        Cookie: `better-auth.session_token=${sessionCookie.value}`,
      },
    });

    if (!response.ok) {
      console.log("Failed to get Convex token:", response.status);
      return null;
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("Error getting Convex token:", error);
    return null;
  }
};

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("better-auth.session_token");
  return !!sessionCookie?.value;
};