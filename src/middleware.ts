import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, getExpectedSession, isSiteClosed } from "@/lib/admin-auth";

// 로그인 없이 열 수 있는 경로: 종료 안내, 로그인 화면, 로그인 API
const PUBLIC_PATHS = ["/closed", "/admin/login", "/api/admin-login", "/api/admin-logout"];

/**
 * 사이트 잠금
 * - /admin 이하: 항상 로그인 쿠키가 있어야 열린다 (로그인 페이지 제외)
 * - 그 밖의 페이지: 사이트가 종료(비공개) 상태면 로그인한 사람만 열 수 있고, 나머지는 종료 안내 페이지로 보낸다
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  if (!isAdminPath && !isSiteClosed()) return NextResponse.next();

  const expected = await getExpectedSession();
  if (req.cookies.get(ADMIN_COOKIE)?.value === expected) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.search = "";
  if (isAdminPath) {
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
  } else {
    // 일반 방문자는 종료 안내 페이지로 보낸다
    url.pathname = "/closed";
  }
  return NextResponse.redirect(url);
}

export const config = {
  // 정적 파일(확장자가 있는 경로)과 Next 내부 경로는 제외
  matcher: ["/((?!_next/|fonts/|images/|characters/|.*\\..*).*)"],
};
