"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { event } from "@/data/event";
import QrCode from "@/components/common/QrCode";
import { Sparkles, Calendar, MapPin, BookOpen, Smartphone } from "lucide-react";

/**
 * 01 INTRO SLIDE
 * 참고 포스터(참고2.jpg) 및 장난감 프레임(참고1.jpg)의 무드를 극대화한 메인 인트로
 */
export default function IntroSlide() {
  const [joinUrl, setJoinUrl] = useState<string>("/join");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setJoinUrl(`${window.location.origin}/join`);
    }
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between py-3 px-3 sm:py-6 sm:px-8 md:px-10 z-10 select-none gap-4 md:gap-2">
      {/* 상단 교회 및 부서명 배너 */}
      <div className="plate flex flex-col items-center gap-1 px-6 py-2">
        <span className="text-lg sm:text-xl md:text-2xl font-black text-neutral-800 tracking-tight">
          {event.church}
        </span>
        <div className="pop-tag bg-crayon-pink text-white text-xs sm:text-sm px-4 sm:px-5 py-1 uppercase tracking-wider font-extrabold shadow-pop-sm rotate-[-1deg]">
          ✨ {event.ministry} ✨
        </div>
      </div>

      {/* 중앙 메인: 포스터 스타일 타이포 + 스프링 수첩 카드 */}
      <div className="flex flex-col items-center text-center my-auto max-w-4xl w-full">
        {/* 못말리는 령고을 컬러풀 볼드 타이틀 */}
        <div className="relative mb-2 sm:mb-3">
          <span className="letter-outline-white text-2xl sm:text-4xl md:text-4xl font-black text-crayon-yellow tracking-tight block mb-0.5 sm:mb-1">
            못말리는
          </span>
          <h1 className="text-5xl sm:text-7xl md:text-7xl lg:text-7xl font-black tracking-tight drop-shadow-sm flex items-center justify-center gap-1 sm:gap-2">
            <span className="letter-outline-white text-crayon-pink">령</span>
            <span className="letter-outline-white text-crayon-blue">고</span>
            <span className="letter-outline-white text-sky-400">을</span>
          </h1>
        </div>

        {/* 성경 구절 인용 */}
        <p className="plate mb-3 max-w-2xl px-4 py-2 text-xs font-extrabold leading-snug text-neutral-800 sm:mb-4 sm:text-base md:text-base">
          &ldquo;{event.themeVerseContent}&rdquo;
          <span className="block text-[11px] sm:text-xs font-mono font-bold text-neutral-500 mt-1">
            — {event.bibleVerse}
          </span>
        </p>

        {/* 스프링 수첩 노트 카드 (포스터의 일시/장소/주제 수첩 재현) */}
        <div className="pop-card bg-white p-3 sm:p-4 border-3 sm:border-4 border-black max-w-xl w-full relative shadow-pop-lg flex items-center">
          {/* 좌측 스프링 바인더 링 구멍 효과 (모바일에서는 숨김) */}
          <div className="hidden sm:flex flex-col justify-between h-full py-1 pr-4 border-r-2 border-dashed border-neutral-300 gap-2 shrink-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-3.5 h-3.5 rounded-full bg-neutral-800 border-2 border-neutral-400 shadow-inner"
              />
            ))}
          </div>

          {/* 수첩 내부 텍스트 그리드 */}
          <div className="flex-1 sm:pl-5 text-left space-y-2 sm:space-y-2.5">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-black text-white text-[11px] sm:text-xs font-black shrink-0">
                일시
              </span>
              <span className="text-sm sm:text-base md:text-lg font-black text-neutral-900">
                {event.displayDate} {event.startTime} ~ {event.endTime}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-black text-white text-[11px] sm:text-xs font-black shrink-0">
                장소
              </span>
              <span className="text-sm sm:text-base md:text-lg font-black text-neutral-900">
                {event.location}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-black text-white text-[11px] sm:text-xs font-black shrink-0">
                주제
              </span>
              <span className="text-sm sm:text-base md:text-lg font-black text-crayon-red">
                예배 ({event.bibleVerse})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 QR 코드 및 실시간 접속 안내 */}
      <div className="w-full max-w-2xl pop-card bg-crayon-yellow/95 p-3 sm:p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-3 border-black shadow-pop">
        <div className="flex items-center gap-3 sm:gap-3.5">
          <QrCode value={joinUrl} size={74} />
          <div className="text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-crayon-red text-white text-[11px] font-black shadow-pop-sm mb-1">
              <Smartphone className="w-3 h-3" />
              <span>스마트폰 카메라로 QR 스캔</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-black">
              지금 실시간 참여하기
            </h3>
            <p className="text-[11px] text-neutral-700 font-bold">
              별도 가입 없이 닉네임만 넣고 바로 참여!
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:items-end text-center sm:text-right">
          <span className="text-[11px] sm:text-xs font-black text-neutral-800">
            우리들의 못말리는 하루가 시작됩니다! ♡
          </span>
          <span className="text-[11px] sm:text-xs font-black text-crayon-pink mt-0.5">
            많은 기대와 많은 참여 부탁해요! ✨
          </span>
        </div>
      </div>

      {/* 가장자리 캐릭터 포인트 (짱구 & 맹구 - 대형 화면에서만 표시하여 모바일 간섭 방지) */}
      <div className="plate absolute -left-2 bottom-4 hidden h-40 w-40 items-center justify-center rounded-full p-3 pointer-events-none xl:flex">
        <Image
          src="/characters/shinchan.png"
          alt="짱구"
          width={160}
          height={160}
          className="h-full w-full object-contain"
          priority
        />
      </div>

      <div className="plate absolute -right-2 bottom-4 hidden h-36 w-36 items-center justify-center rounded-full p-3 pointer-events-none xl:flex">
        <Image
          src="/characters/maenggu.png"
          alt="맹구"
          width={150}
          height={150}
          className="h-full w-full object-contain"
          priority
        />
      </div>
    </div>
  );
}
