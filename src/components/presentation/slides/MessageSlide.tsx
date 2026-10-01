"use client";

import React from "react";
import { event } from "@/data/event";
import { BookOpen, Sparkles, User } from "lucide-react";

/**
 * 06 MESSAGE SLIDE
 * 말씀 및 예배 슬라이드 - 차분하고 집중되는 정돈된 분위기
 */
export default function MessageSlide() {
  return (
    <div className="relative w-full h-full flex flex-col justify-between py-4 px-3 sm:py-8 sm:px-10 md:px-14 z-10 select-none gap-4">
      {/* 상단 뱃지 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-400 border-2 border-black flex items-center justify-center text-black">
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <span className="text-xs font-bold text-neutral-700 sm:text-sm">{event.eventLabel}</span>
        </div>

        <div className="pop-tag bg-white text-neutral-800 text-[11px] sm:text-xs font-bold">
          {event.displayDate} 예배
        </div>
      </div>

      {/* 중앙 메인: 말씀 제목 & 주제 성구 카드 */}
      <div className="my-auto max-w-4xl mx-auto w-full text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-extrabold text-amber-700 mb-2 sm:mb-3 bg-amber-100/80 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-amber-300">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
          <span>마태복음 5장 16절</span>
        </div>

        {/* 말씀 메인 타이틀 */}
        <h1 className="mb-4 text-3xl font-black tracking-tight text-neutral-900 sm:mb-8 sm:text-5xl md:text-7xl lg:text-8xl">
          세상의 빛
        </h1>

        {/* 성경 본문 말씀 구절 카드 (차분하고 정돈된 카드) */}
        <div className="pop-card bg-white p-4 sm:p-8 md:p-10 border-3 sm:border-4 border-black w-full text-center shadow-pop-lg relative">
          <p className="text-base sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-neutral-800 leading-relaxed tracking-tight text-center">
            &ldquo;{event.themeVerseContent}&rdquo;
          </p>
          <div className="mt-4 sm:mt-6 text-center text-sm font-black text-neutral-600 sm:text-base">
            마태복음 5장 16절 (개역개정)
          </div>
        </div>

        {/* 나눔시간 안내 */}
        <div className="mt-4 sm:mt-8 flex items-center gap-2 font-bold text-xs sm:text-base text-neutral-700 pop-card px-4 sm:px-6 py-2 sm:py-2.5 bg-white/80">
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-crayon-blue" />
          <span className="font-black text-black">나눔시간</span>
        </div>
      </div>

      {/* 하단 기도와 묵상 안내 문구 */}
      <div className="plate mx-auto px-4 py-1.5 text-center text-xs font-bold text-neutral-600">
        말씀을 통해 우리에게 주시는 하나님의 음성에 귀 기울입니다.
      </div>
    </div>
  );
}
