"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="from-background via-background to-muted/20 relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-br p-4">
      <div className="from-primary/5 to-secondary/5 absolute inset-0 bg-linear-to-br via-transparent" />
      <div className="bg-primary/10 absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl" />
      <div className="bg-secondary/10 absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl delay-1000" />

      <Toaster position="top-left" />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="from-primary via-primary/80 to-secondary mb-2 bg-linear-to-r bg-clip-text text-4xl font-bold text-transparent">
            Breaklog
          </h1>
          <p className="text-muted-foreground text-lg">
            {pathname === "/login"
              ? "Welcome back! Sign in to continue"
              : "Join us today and get started"}
          </p>
        </div>

        <Card className="bg-card/80 border-border/50 w-full overflow-hidden rounded-3xl shadow-2xl backdrop-blur-xl">
          <div className="from-primary/5 to-secondary/5 pointer-events-none absolute inset-0 bg-linear-to-br" />
          <CardContent className="relative z-10 p-8">{children}</CardContent>
        </Card>

        <div className="mt-6 text-center">
          <div className="bg-card/30 border-border/30 rounded-2xl border p-4 backdrop-blur-sm">
            {pathname === "/login" ? (
              <p className="text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-primary hover:text-primary/80 font-semibold decoration-2 underline-offset-4 transition-colors duration-200 hover:underline"
                >
                  Sign up here
                </Link>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:text-primary/80 font-semibold decoration-2 underline-offset-4 transition-colors duration-200 hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
