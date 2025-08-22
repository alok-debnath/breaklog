"use client";
import {
  ArrowLeft,
  History,
  LogOut,
  Menu,
  Settings,
  User,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useStore } from "@/stores/store";
import { ModeToggle } from "../mode-toggle";

const Navbar = () => {
  const { userData } = useStore();
  const pathname = usePathname();
  const [backPath, setBackPath] = useState("");

  useEffect(() => {
    if (pathname !== "/dashboard") {
      const parts = pathname.split("/");
      setBackPath(parts.slice(0, -1).join("/"));
    } else {
      setBackPath("");
    }
  }, [pathname]);

  const logout = () => signOut({ callbackUrl: "/login" });

  return (
    <div className="fixed top-6 left-1/2 z-50 w-[90%] -translate-x-1/2 md:w-auto md:min-w-[768px]">
      <header className="from-card/95 to-card/80 border-border/50 relative overflow-hidden rounded-3xl border bg-gradient-to-r shadow-2xl backdrop-blur-xl">
        {/* Background decoration */}
        <div className="from-primary/5 to-primary/5 absolute inset-0 bg-gradient-to-r via-transparent" />
        <div className="bg-primary/10 absolute -top-2 -right-2 h-8 w-8 rounded-full" />
        <div className="bg-primary/5 absolute -bottom-2 -left-2 h-6 w-6 rounded-full" />

        <div className="relative flex h-16 items-center justify-between px-6">
          {/* Mobile Menu & Back Button */}
          <div className="flex items-center md:hidden">
            {backPath ? (
              <Link href={backPath} passHref>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent/50 h-10 w-10 rounded-2xl transition-all duration-200 hover:scale-105"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-accent/50 h-10 w-10 rounded-2xl transition-all duration-200 hover:scale-105"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="bottom"
                  align="start"
                  className="border-border/50 bg-card/95 rounded-2xl backdrop-blur-xl"
                >
                  <DropdownMenuItem className="hover:bg-accent/50 cursor-pointer rounded-xl transition-colors duration-200">
                    <Link
                      href="/dashboard/history"
                      className="flex h-full w-full items-center gap-2"
                    >
                      <History className="h-4 w-4" />
                      History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-accent/50 cursor-pointer rounded-xl transition-colors duration-200">
                    <Link
                      href="/dashboard/profile"
                      className="flex h-full w-full items-center gap-2"
                    >
                      <UserCircle className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Brand */}
          <Link href="/dashboard" className="flex items-center gap-3 md:hidden">
            <div className="from-primary/20 to-primary/10 border-primary/20 flex h-8 w-8 items-center justify-center rounded-xl border bg-gradient-to-br">
              <div className="from-primary to-primary/80 h-4 w-4 rounded-md bg-gradient-to-br" />
            </div>
            <span className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent">
              Breaklog
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="from-primary/20 to-primary/10 border-primary/20 flex h-10 w-10 items-center justify-center rounded-2xl border bg-gradient-to-br">
                <div className="from-primary to-primary/80 h-5 w-5 rounded-lg bg-gradient-to-br" />
              </div>
              <span className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent">
                Breaklog
              </span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/dashboard/history"
                className={cn(
                  "flex items-center gap-2 rounded-2xl px-4 py-2 font-medium transition-all duration-200 hover:scale-105",
                  pathname.startsWith("/dashboard/history")
                    ? "from-primary/10 to-primary/5 text-primary border-primary/20 border bg-gradient-to-r"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                )}
              >
                <History className="h-4 w-4" />
                History
              </Link>
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent/50 h-10 w-10 rounded-2xl transition-all duration-200 hover:scale-105"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="border-border/50 bg-card/95 min-w-[200px] rounded-2xl backdrop-blur-xl"
              >
                <div className="border-border/50 border-b px-3 py-2">
                  <p className="text-muted-foreground text-sm font-medium">
                    Signed in as
                  </p>
                  <p className="text-foreground truncate text-sm font-semibold">
                    {userData.username || "User"}
                  </p>
                </div>
                <DropdownMenuItem className="hover:bg-accent/50 mt-1 cursor-pointer rounded-xl transition-colors duration-200">
                  <Link
                    href="/dashboard/profile"
                    className="flex h-full w-full items-center gap-2"
                  >
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    useStore.setState({ isSettingsModalOpen: true })
                  }
                  className="hover:bg-accent/50 cursor-pointer rounded-xl transition-colors duration-200"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer rounded-xl text-red-500 transition-colors duration-200 hover:bg-red-500/10 hover:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
