import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  SITE_COOKIE,
  getExpectedSession,
  getExpectedSiteSession,
  isSiteClosed,
} from "@/lib/admin-auth";

// 로그인 없이 열 수 있는 경로: 입장 화면, 관리자 로그인 화면, 로그인/로그아웃 API
const PUBLIC_PATHS = [
  "/enter",
  "/admin/login",
  "/api/site-login",
  "/api/admin-login",
  "/api/admin-logout",
];

/**
 * 사이트 잠금
 * - /admin 이하: 관리자 로그인 쿠키가 있어야 열린다 (로그인 페이지 제외)
 * - 그 밖의 페이지: 사이트 입장 비밀번호(또는 관리자 로그인)를 거친 사람만 열 수 있고,
 *   아니면 입장 화면으로 보낸다
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  if (!isAdminPath && !isSiteClosed()) return NextResponse.next();

  const isAdmin = req.cookies.get(ADMIN_COOKIE)?.value === (await getExpectedSession());
  if (isAdmin) return NextResponse.next();

  if (!isAdminPath) {
    const isVisitor = req.cookies.get(SITE_COOKIE)?.value === (await getExpectedSiteSession());
    if (isVisitor) return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.search = "";
  url.pathname = isAdminPath ? "/admin/login" : "/enter";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  // 정적 파일(확장자가 있는 경로)과 Next 내부 경로는 제외
  matcher: ["/((?!_next/|fonts/|images/|characters/|.*\\..*).*)"],
};
