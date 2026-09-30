import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, getAdminPassword, getExpectedSession } from "@/lib/admin-auth";

// 로그인 여부 확인: 브라우저가 쿠키를 실제로 저장했는지 로그인 화면에서 검사할 때 쓴다
export async function GET(req: NextRequest) {
  const authed = req.cookies.get(ADMIN_COOKIE)?.value === (await getExpectedSession());
  return NextResponse.json({ authed });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { password?: string };

  if (body.password !== getAdminPassword()) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await getExpectedSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12, // 12시간 유지
  });
  return res;
}
