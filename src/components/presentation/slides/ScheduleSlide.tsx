"use client";

import React from "react";
import Image from "next/image";
import { event } from "@/data/event";
import { scheduleList } from "@/data/schedule";
import { EventState } from "@/types";
import { Clock, CheckCircle2, PlayCircle, ArrowRight } from "lucide-react";

interface ScheduleSlideProps {
  eventState: EventState;
}

/**
 * 02 TODAY'S SCHEDULE SLIDE
 * 전체 행사 시간표 및 NOW / NEXT 실시간 강조 타임라인
 */
export default function ScheduleSlide({ eventState }: ScheduleSlideProps) {
  const currentIndex = Math.max(
    0,
    scheduleList.findIndex((item) => item.id === eventState.currentProgramId)
  );

  const currentProgram = scheduleList[currentIndex] || scheduleList[0];
  const nextProgram = scheduleList[currentIndex + 1] || null;

  return (
    <div className="relative w-full h-full flex flex-col justify-between py-4 px-3 sm:py-6 sm:px-8 md:px-12 z-10 gap-4 sm:gap-6">
      {/* 상단 타이틀 바 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
        <div className="plate flex shrink-0 flex-col items-center whitespace-nowrap px-6 py-3 text-center">
          <div className="pop-tag bg-crayon-yellow text-black text-xs mb-1">{event.eventLabel}</div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight">
            오늘의 <span className="text-crayon-pink">시간표</span>
          </h2>
        </div>

        {/* 현재 시각 및 안내 배너 */}
        <div className="pop-card px-3.5 sm:px-5 py-2 sm:py-2.5 bg-white flex items-center gap-2 sm:gap-3">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-crayon-blue" />
          <span className="font-extrabold text-xs sm:text-sm text-neutral-700">
            총 8개 프로그램 진행 예정
          </span>
        </div>
      </div>

      {/* 중앙 메인 레이아웃: 반응형 그리드 (모바일 단일열, 데스크톱 12열 분할) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 my-auto items-center w-full">
        {/* 전체 순서 목록 (모바일 2번째 순서, 데스크톱 좌측 7열) */}
        <div className="col-span-1 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3.5 order-2 lg:order-1">
          {scheduleList.map((item, idx) => {
            const isCurrent = item.id === eventState.currentProgramId;
            const isPast = idx < currentIndex;

            return (
              <div
                key={item.id}
                className={`border-2 sm:border-3 border-black rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 transition-all ${
                  isCurrent
                    ? "bg-crayon-yellow shadow-pop scale-[1.02] ring-3 ring-crayon-pink"
                    : isPast
                    ? "bg-white/60 opacity-60 shadow-pop-sm"
                    : "bg-white shadow-pop-sm hover:shadow-pop"
                }`}
              >
                <div
                  className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl border-2 border-black flex items-center justify-center font-black text-xs sm:text-sm shrink-0 ${
                    isCurrent
                      ? "bg-crayon-red text-white"
                      : isPast
                      ? "bg-neutral-200 text-neutral-500"
                      : "bg-crayon-blue text-black"
                  }`}
                >
                  {isPast ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : `0${idx + 1}`}
                </div>

                <div className="overflow-hidden">
                  <span className="text-[10px] sm:text-xs font-black text-neutral-500 block font-mono">
                    {item.timeRange}
                  </span>
                  <h4 className="text-sm sm:text-base font-extrabold truncate text-crayon-text">
                    {item.title}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>

        {/* 우측 NOW & NEXT 하이라이트 (모바일 1번째 순서, 데스크톱 우측 5열) */}
        <div className="col-span-1 lg:col-span-5 flex flex-col gap-3 sm:gap-5 order-1 lg:order-2">
          {/* NOW 대형 카드 */}
          <div className="pop-card bg-crayon-yellow p-4 sm:p-6 relative overflow-hidden border-3 sm:border-4 border-black">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-crayon-red text-white rounded-full font-black text-[11px] sm:text-xs tracking-wider uppercase flex items-center gap-1 shadow-pop-sm animate-pulse">
                <PlayCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                NOW 진행 중
              </span>
              <span className="font-mono font-bold text-xs sm:text-sm text-neutral-700">
                {currentProgram.timeRange}
              </span>
            </div>

            <h3 className="text-xl sm:text-3xl font-black text-crayon-text mb-1 sm:mb-2">
              {currentProgram.title}
            </h3>
            {currentProgram.subTitle && (
              <p className="text-xs sm:text-base font-bold text-neutral-800 mb-1.5 sm:mb-2">
                &ldquo;{currentProgram.subTitle}&rdquo;
              </p>
            )}
            <p className="text-[11px] sm:text-xs text-neutral-600 font-medium line-clamp-2">
              {currentProgram.description}
            </p>

            {/* 카드 하단 오른쪽 작은 캐릭터 데코 */}
            <div className="absolute -right-2 -bottom-3 w-16 h-16 sm:w-20 sm:h-20 opacity-90 pointer-events-none">
              <Image
                src="/characters/yuri.png"
                alt="유리"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          </div>

          {/* NEXT 카드 */}
          {nextProgram ? (
            <div className="pop-card bg-white p-3.5 sm:p-5 border-2 sm:border-3 border-black">
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 bg-crayon-blue text-black rounded-full font-black text-xs tracking-wider uppercase flex items-center gap-1 shadow-pop-sm">
                  <ArrowRight className="w-3.5 h-3.5" />
                  NEXT 다음 순서
                </span>
                <span className="font-mono font-bold text-xs text-neutral-500">
                  {nextProgram.timeRange}
                </span>
              </div>
              <h4 className="text-xl font-black text-neutral-800">
                {nextProgram.title}
              </h4>
              <p className="text-xs text-neutral-600 font-bold mt-1">
                {nextProgram.subTitle || nextProgram.description}
              </p>
            </div>
          ) : (
            <div className="pop-card bg-neutral-100 p-4 text-center text-sm font-bold text-neutral-500">
              마지막 순서입니다! 함께해주셔서 감사합니다 ❤️
            </div>
          )}
        </div>
      </div>

      {/* 하단 여백 가이드 */}
      <div className="plate flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 text-xs font-bold text-neutral-600">
        <span>* 진행 상황에 따라 시간이 약간 변동될 수 있습니다.</span>
        <span className="hidden sm:inline">키보드 방향키(◀, ▶) 또는 스페이스바로 슬라이드 이동</span>
      </div>
    </div>
  );
}
