import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === "ADMIN";

  // Admin route korumasi
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/giris", req.url));
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Kullanici hesap ve checkout korumasi
  if (pathname.startsWith("/hesabim") || pathname.startsWith("/odeme")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(`/giris?redirect=${pathname}`, req.url)
      );
    }
  }

  // Giris yapmissa giris/kayit sayfasina erismesin
  if ((pathname === "/giris" || pathname === "/kayit") && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/hesabim/:path*", "/odeme/:path*", "/giris", "/kayit"],
};
