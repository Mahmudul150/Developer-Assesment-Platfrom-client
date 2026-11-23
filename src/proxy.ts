import { type NextRequest, NextResponse } from "next/server";
import { ROLE_HOME, roleFromToken } from "@/lib/auth";
import { Role, type Role as RoleType } from "@/types/enums";

const protectedRoutes: Record<string, RoleType> = {
  "/admin": Role.ADMIN,
  "/company": Role.COMPANY,
  "/candidate": Role.CANDIDATE,
};

const authRoutes = ["/login", "/register", "/verify-email"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;
  const role = roleFromToken(token);

  for (const [prefix, requiredRole] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(prefix)) {
      if (!role) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.search = "";
        url.searchParams.set("next", `${pathname}${search}`);
        return NextResponse.redirect(url);
      }
      if (role !== requiredRole) {
        const url = request.nextUrl.clone();
        url.pathname = ROLE_HOME[role];
        url.search = "";
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }
  }

  if (authRoutes.includes(pathname) && role) {
    const url = request.nextUrl.clone();
    url.pathname = ROLE_HOME[role];
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
