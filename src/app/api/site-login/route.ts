import { NextRequest, NextResponse } from "next/server";
import { SITE_COOKIE, getSitePassword, getExpectedSiteSession } from "@/lib/admin-auth";

// 입장 여부 확인: 브라우저가 쿠키를 실제로 저장했는지 입력 화면에서 검사할 때 쓴다
export async function GET(req: NextRequest) {
  const authed = req.cookies.get(SITE_COOKIE)?.value === (await getExpectedSiteSession());
  return NextResponse.json({ authed });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { password?: string };

  if (body.password !== getSitePassword()) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SITE_COOKIE, await getExpectedSiteSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24, // 하루 동안 유지
  });
  return res;
}
