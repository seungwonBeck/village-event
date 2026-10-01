"use client";

import React from "react";
import Image from "next/image";
import { scheduleList } from "@/data/schedule";
import { EventState } from "@/types";
import { Sparkles } from "lucide-react";

interface TransitionSlideProps {
  eventState: EventState;
  // 지정하면 현재 진행 프로그램 대신 이 프로그램을 보여준다 (예: 점심 시간 슬라이드)
  programId?: string;
  // 오른쪽 아래에 나오는 캐릭터 (슬라이드마다 다르게)
  characterSrc?: string;
  characterAlt?: string;
  // 한글 프로그램 제목을 바꿔 보여주고 싶을 때
  titleOverride?: string;
  // 제목 아래에 붙는 소제목 (예: 아이스브레이킹 활동 안내)
  subtitle?: string;
}

/**
 * 03 PROGRAM TRANSITION SLIDE
 * 레크레이션페이지.png의 시원한 비비드 스카이블루와 볼드 타이포 디자인 완벽 구현
 */
export default function TransitionSlide({
  eventState,
  programId,
  characterSrc = "/characters/himawari.png",
  characterAlt = "짱아",
  titleOverride,
  subtitle,
}: TransitionSlideProps) {
  const program =
    scheduleList.find((p) => p.id === (programId ?? eventState.currentProgramId)) ||
    scheduleList.find((p) => p.id === "recreation") ||
    scheduleList[0];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 z-10 text-center select-none">
      {/* 중앙 네오 브루탈리즘 포커스 카드 (배경 일렉트릭 버스트와 환상적으로 조화) */}
      <div className="pop-card bg-white/95 backdrop-blur-md border-3 sm:border-5 border-black rounded-2xl sm:rounded-3xl p-5 sm:p-10 md:p-14 max-w-4xl w-full relative shadow-pop-xl">
        {/* 상단 핫이슈 알약 뱃지 */}
        <div className="inline-block border-2 sm:border-4 border-black bg-crayon-yellow px-4 sm:px-8 py-1.5 sm:py-2.5 rounded-full font-black text-sm sm:text-xl tracking-wider shadow-pop-sm mb-4 sm:mb-6 -rotate-1 hover:rotate-0 transition-transform">
          ⚡ NEXT PROGRAM ⚡
        </div>

        {/* 초대형 영문 프로그램명 */}
        <h1 className="text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-neutral-900 tracking-tight sm:tracking-tight uppercase mb-2 sm:mb-3 drop-shadow-sm break-words">
          {program.id === "recreation" ? "RECREATION" : program.id.toUpperCase()}
        </h1>

        {/* 한글 프로그램 타이틀 */}
        <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-crayon-pink tracking-tight mb-4 sm:mb-6 drop-shadow-[2px_2px_0px_#000]">
          {titleOverride ?? program.title}
        </h2>

        {subtitle && (
          <p className="mb-4 text-lg font-bold text-neutral-700 sm:mb-6 sm:text-3xl">{subtitle}</p>
        )}

        {/* 시간대 표시 뱃지 */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-neutral-900 text-crayon-yellow px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl border-2 sm:border-3 border-black text-base sm:text-xl md:text-3xl font-black font-mono tracking-tight shadow-pop-sm">
          <span>{program.startTime}</span>
          <span>—</span>
          <span>{program.endTime}</span>
        </div>

        {/* 레트로 장식 별모양 포인트 */}
        <div className="absolute top-8 right-10 text-crayon-yellow text-4xl animate-pulse">
          ✦
        </div>
        <div className="absolute bottom-8 left-10 text-crayon-blue text-3xl">
          ✦
        </div>

        {/* 우측 하단 귀여운 짱아 캐릭터 포인트 */}
        <div className="absolute -right-6 -bottom-6 w-36 h-36 pointer-events-none hidden md:block">
          <Image
            src={characterSrc}
            alt={characterAlt}
            width={130}
            height={130}
            className="object-contain drop-shadow-md"
          />
        </div>

        {/* 좌측 상단 살짝 빼꼼 핑크 포인트 */}
        <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full bg-crayon-pink border-4 border-black pointer-events-none" />
      </div>
    </div>
  );
}
