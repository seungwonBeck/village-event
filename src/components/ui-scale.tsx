"use client";

import { useEffect } from "react";

/**
 * 메인 페이지를 뺀 나머지 페이지의 글자·간격 배율 (html에 클래스를 붙여 rem 기준을 바꾼다).
 * - large(프레젠테이션/어드민): 1920px에서 1.125배, 1280px 이하는 기본 크기
 * - compact(참가자 휴대폰 페이지): 1024px 이상 화면에서만 0.75배, 휴대폰은 기본 크기 유지
 */
export default function UiScale({ mode = "large" }: { mode?: "large" | "compact" }) {
  useEffect(() => {
    const className = mode === "large" ? "ui-scale" : "ui-scale-compact";
    document.documentElement.classList.add(className);
    return () => document.documentElement.classList.remove(className);
  }, [mode]);
  return null;
}
