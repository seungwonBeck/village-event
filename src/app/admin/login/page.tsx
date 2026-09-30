"use client";

import React, { useState } from "react";
import { Lock } from "lucide-react";

/**
 * 어드민 비밀번호 입력 화면
 * 맞으면 원래 가려던 어드민 페이지로 이동한다.
 */
export default function AdminLoginPage() {
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      // 쿼리의 next 경로(/admin 하위만 허용)로 이동
      const next = new URLSearchParams(window.location.search).get("next");
      window.location.href = next && next.startsWith("/admin") ? next : "/admin";
      return;
    }

    setError("비밀번호가 맞지 않아요. 다시 입력해 주세요.");
    setPassword("");
    setIsLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-shin-paper px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl border-3 border-black bg-white p-7 text-center shadow-pop-lg"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-3 border-black bg-shin-yellow">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-2xl">진행자 콘솔</h1>
        <p className="mt-1 text-sm text-ink/70">비밀번호를 입력해야 들어갈 수 있어요.</p>

        <label htmlFor="admin-password" className="sr-only">
          비밀번호
        </label>
        <input
          id="admin-password"
          type="password"
          inputMode="numeric"
          autoComplete="current-password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="mt-5 w-full rounded-2xl border-3 border-black bg-neutral-50 px-4 py-3 text-center text-lg tracking-[0.3em] focus:outline-none focus:ring-4 focus:ring-shin-sky"
        />

        {error && (
          <p role="alert" className="mt-3 text-sm text-shin-red">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || password.length === 0}
          className="mt-5 w-full rounded-2xl border-3 border-black bg-shin-red py-3 text-lg text-white shadow-pop transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40"
        >
          {isLoading ? "확인 중..." : "들어가기"}
        </button>
      </form>
    </main>
  );
}
