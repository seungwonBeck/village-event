"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Presentation, Calendar, Users, Heart } from "lucide-react";

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-4 border-dashed border-black/30 bg-shin-paper/95 backdrop-blur-md">
      <div className="flex min-h-16 sm:min-h-20 items-center justify-between gap-3 px-4 sm:px-6 md:px-[80px]">
        <Link
          href="/"
          aria-label="못말리는 령고을 홈"
          className="flex items-baseline gap-1.5 sm:gap-2 font-black tracking-tight"
        >
          <span className="font-hand text-xl sm:text-2xl text-ink">못말리는</span>
          <span className="text-xl sm:text-2xl text-ink">
            <span className="text-shin-pink">령</span><span className="text-shin-sky">고</span><span className="text-shin-pink">을</span>
          </span>
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav aria-label="주 메뉴" className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-bold">
          <Link href="/#about" className="transition-colors hover:text-shin-red">
            우리의 하루
          </Link>
          <Link href="/#schedule" className="transition-colors hover:text-shin-red">
            시간표
          </Link>
          <Link href="/#community" className="transition-colors hover:text-shin-red">
            사랑방
          </Link>
          <Link
            href="/presentation"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-black bg-crayon-pink/20 hover:bg-crayon-pink text-ink hover:text-white transition-all shadow-pop-sm"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>프레젠테이션</span>
          </Link>
        </nav>

        {/* 모바일 햄버거 토글 버튼 & 함께하기 버튼 */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl border-2 border-black bg-white text-ink shadow-pop-sm active:scale-95"
            aria-label="메뉴 열기"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t-2 border-black/10 bg-white px-4 py-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2 font-black text-sm">
            <Link
              href="/#about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-neutral-100 transition-colors"
            >
              <Heart className="w-4 h-4 text-crayon-pink" />
              <span>우리의 하루 (소개)</span>
            </Link>
            <Link
              href="/#schedule"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-neutral-100 transition-colors"
            >
              <Calendar className="w-4 h-4 text-crayon-blue" />
              <span>오늘의 시간표</span>
            </Link>
            <Link
              href="/#community"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-neutral-100 transition-colors"
            >
              <Users className="w-4 h-4 text-crayon-green" />
              <span>사랑방 & 가장님 소개</span>
            </Link>
            <Link
              href="/presentation"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl border-2 border-black bg-crayon-yellow text-ink shadow-pop-sm"
            >
              <div className="flex items-center gap-2.5">
                <Presentation className="w-4 h-4 text-crayon-red" />
                <span>프레젠테이션 스크린</span>
              </div>
              <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded-full border border-black">
                슬라이드
              </span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
