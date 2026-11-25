import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ROLE_HOME } from "@/lib/auth";
import { APP_NAME } from "@/lib/constants";
import { getSessionFromCookies } from "@/lib/session";
import { cn } from "@/lib/utils";
import { Role } from "@/types/enums";
import { MobileNav } from "./mobile-nav";
import { UserMenu } from "./user-menu";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/assessments", label: "Assessments" },
  { href: "/contact", label: "Contact" },
];

export async function Navbar() {
  const session = await getSessionFromCookies();
  const home = session.role ? ROLE_HOME[session.role] : null;
  const links = home
    ? [...publicLinks, { href: home, label: "Dashboard" }]
    : publicLinks;
  const authLinks = session.isLoggedIn
    ? undefined
    : [
        { href: "/login", label: "Log in", variant: "ghost" as const },
        { href: "/register", label: "Register" },
      ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            D
          </span>
          {APP_NAME}
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {session.isLoggedIn ? (
            <>
              <Link
                href={home ?? "/"}
                className={cn(buttonVariants(), "hidden sm:inline-flex")}
              >
                Dashboard
              </Link>
              <UserMenu
                name={session.payload?.name ?? "User"}
                email={session.payload?.email ?? ""}
                role={session.role ?? Role.CANDIDATE}
              />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "hidden sm:inline-flex",
                )}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className={cn(buttonVariants(), "hidden sm:inline-flex")}
              >
                Register
              </Link>
            </>
          )}
          <MobileNav links={links} authLinks={authLinks} />
        </div>
      </div>
    </header>
  );
}
