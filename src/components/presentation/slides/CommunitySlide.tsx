"use client";

import { event } from "@/data/event";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { groups, LeaderGroupItem } from "@/data/groups";
import { ChevronLeft, ChevronRight, Heart, Sparkles, Crown } from "lucide-react";

/**
 * 08 COMMUNITY SLIDE
 * 가장(리더) 및 식구들 소개 슬라이드
 * - 김령희 을장님
 * - 이채희 부가장님
 * - 000 가장님
 */
export default function CommunitySlide() {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const currentLeader: LeaderGroupItem = groups[selectedIdx] || groups[0];

  const handleNext = () => {
    if (selectedIdx < groups.length - 1) {
      setSelectedIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (selectedIdx > 0) {
      setSelectedIdx((prev) => prev - 1);
    }
  };

  // 방향키/스페이스로 가장님을 한 명씩 넘긴다. 첫 번째의 ←, 마지막의 →는 슬라이드 이동에 양보한다
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      const isNextKey = e.key === "ArrowRight" || e.key === " ";
      if (isNextKey && selectedIdx < groups.length - 1) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setSelectedIdx(selectedIdx + 1);
      } else if (e.key === "ArrowLeft" && selectedIdx > 0) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setSelectedIdx(selectedIdx - 1);
      }
    };
    // 캡처 단계에서 먼저 받아야 슬라이드 컨테이너의 단축키보다 앞선다
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [selectedIdx]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between py-4 px-3 sm:py-6 sm:px-8 md:px-12 z-10 select-none gap-4 sm:gap-6">
      {/* 상단: 제목은 한 줄 전체, 그 아래 가장 선택 탭을 한 줄로 */}
      <div className="flex flex-col gap-3">
        <div className="plate w-full px-6 py-3 text-center">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black">
            {event.ministry} 김령희 고을 가장님 소개
          </h2>
        </div>

        <div className="overflow-x-auto py-1">
        <div className="mx-auto flex w-max flex-nowrap items-center gap-1.5">
          {groups.map((g, idx) => {
            const isSpecial = g.roleTitle === "을장님";
            const isSelected = selectedIdx === idx;

            return (
              <button
                key={g.id}
                onClick={() => setSelectedIdx(idx)}
                className={`flex shrink-0 items-center gap-1 whitespace-nowrap rounded-xl border-2 border-black px-3 py-1.5 text-xs font-black transition-all sm:text-sm ${
                  isSelected
                    ? "bg-crayon-pink text-white shadow-pop-sm"
                    : isSpecial
                    ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
                    : "bg-white text-black hover:bg-neutral-100"
                }`}
              >
                {isSpecial && <Crown className="h-3 w-3 text-amber-500" />}
                <span>{g.displayName.replace("님", "")}</span>
              </button>
            );
          })}
        </div>
        </div>
      </div>

      {/* 중앙 메인: 1인 집중 반응형 카드 (모바일 세로 스택, 데스크톱 12열 분할) */}
      <div className="my-auto max-w-5xl mx-auto w-full">
        <div className="pop-card bg-white p-4 sm:p-6 md:p-8 border-3 sm:border-5 border-black grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative overflow-hidden shadow-pop-xl">
          {/* 좌측 (모바일 2번째 순서, 데스크톱 7열): 역할, 이름, 슬로건, 팀원들 */}
          <div className="col-span-1 lg:col-span-7 flex flex-col justify-center order-2 lg:order-1">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="pop-tag bg-crayon-blue text-black font-black text-xs sm:text-sm">
                <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 mr-1 inline" />
                {currentLeader.generation}
              </span>
              <span className="pop-tag bg-crayon-yellow text-black font-black text-xs sm:text-sm">
                {currentLeader.roleTitle}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-4xl font-black text-neutral-900 tracking-tight mb-2 sm:mb-4">
              {currentLeader.displayName}
            </h1>

            {currentLeader.motto && (
              <p className="text-sm sm:text-lg font-bold text-neutral-800 italic mb-4 sm:mb-6 bg-amber-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-dashed border-amber-300">
                &ldquo;{currentLeader.motto}&rdquo;
              </p>
            )}

            {/* 식구들 명단 */}
            {currentLeader.members && currentLeader.members.length > 0 && (
              <div>
                <span className="text-[10px] sm:text-xs font-black text-neutral-500 uppercase tracking-wider block mb-1.5 sm:mb-2">
                  함께하는 식구들
                </span>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {currentLeader.members.map((member, mIdx) => (
                    <span
                      key={mIdx}
                      className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl border-2 border-black font-extrabold text-xs sm:text-sm bg-neutral-100 shadow-pop-sm"
                    >
                      {member}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 우측 (모바일 1번째 순서, 데스크톱 5열): 대표 캐릭터 / 사진 */}
          <div className="col-span-1 lg:col-span-5 flex flex-col items-center justify-center p-2 sm:p-4 order-1 lg:order-2">
            {/* 사진 원본 비율(세로형)을 그대로 크게 보여준다 */}
            <div className="w-56 sm:w-64 lg:w-72 rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-black bg-crayon-yellow/30 p-2 sm:p-3 shadow-pop relative overflow-hidden">
              <Image
                src={currentLeader.image || "/characters/shinchan.png"}
                alt={currentLeader.displayName}
                width={348}
                height={461}
                className="h-auto w-full object-contain drop-shadow-md"
              />
            </div>
            <span className="mt-2 sm:mt-3 text-[11px] sm:text-xs font-black text-neutral-500 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-crayon-pink fill-crayon-pink" />
              <span>사랑으로 섬기는 령고을 리더십</span>
            </span>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="plate flex items-center justify-center px-4 py-2 text-xs font-bold text-neutral-600">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={selectedIdx === 0}
            className="pop-btn px-4 py-1.5 bg-white text-xs disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" /> 이전
          </button>
          <span className="font-mono text-sm font-black text-black">
            {selectedIdx + 1} / {groups.length}
          </span>
          <button
            onClick={handleNext}
            disabled={selectedIdx === groups.length - 1}
            className="pop-btn px-4 py-1.5 bg-white text-xs disabled:opacity-30 disabled:cursor-not-allowed"
          >
            다음 <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
