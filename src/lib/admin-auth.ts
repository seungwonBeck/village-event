/**
 * 어드민 잠금 공통 로직 (미들웨어와 API에서 같이 사용)
 * 비밀번호는 환경 변수 ADMIN_PASSWORD로 바꿀 수 있고, 없으면 기본값 9965를 쓴다.
 */
export const ADMIN_COOKIE = "admin_session";

export const getAdminPassword = (): string => process.env.ADMIN_PASSWORD || "9965";

// 쿠키에는 비밀번호 대신 해시값만 저장한다
export async function getExpectedSession(): Promise<string> {
  const data = new TextEncoder().encode(`ryeonggoul:${getAdminPassword()}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
