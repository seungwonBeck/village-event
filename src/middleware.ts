import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, getExpectedSession } from "@/lib/admin-auth";

// /admin 이하 모든 페이지는 로그인 쿠키가 있어야 열린다 (로그인 페이지 제외)
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const expected = await getExpectedSession();
  if (req.cookies.get(ADMIN_COOKIE)?.value === expected) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
