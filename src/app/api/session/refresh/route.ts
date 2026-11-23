import { type NextRequest, NextResponse } from "next/server";

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:5000";

export async function GET(request: NextRequest) {
  const requested = request.nextUrl.searchParams.get("next") ?? "/";
  const next =
    requested.startsWith("/") && !requested.startsWith("//") ? requested : "/";

  const refreshToken = request.cookies.get("refreshToken")?.value;
  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const response = await fetch(`${backendUrl}/api/v1/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const result = (await response.json()) as {
      data?: { accessToken?: string; refreshToken?: string };
    };

    const redirectResponse = NextResponse.redirect(new URL(next, request.url));

    const getSetCookie = (
      response.headers as Headers & { getSetCookie?: () => string[] }
    ).getSetCookie?.();
    if (getSetCookie?.length) {
      for (const cookie of getSetCookie) {
        redirectResponse.headers.append("set-cookie", cookie);
      }
    } else {
      const accessToken = result.data?.accessToken;
      const newRefreshToken = result.data?.refreshToken;
      if (accessToken) {
        redirectResponse.cookies.set("accessToken", accessToken, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24,
        });
      }
      if (newRefreshToken) {
        redirectResponse.cookies.set("refreshToken", newRefreshToken, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
      }
    }

    return redirectResponse;
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
