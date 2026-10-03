"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { Play, Pause, RotateCcw } from "lucide-react";
import { characterPngs } from "@/components/event-art";

export type TreasureHuntStep = "title" | "steps" | "rule" | "timer";

interface TreasureHuntSlideProps {
  step: TreasureHuntStep;
}

// 퍼즐 찾기 ~ 빛 단어 정하기 제한시간 (7분)
const TIMER_SECONDS = 7 * 60;

const GAME_STEPS = [
  "생명홀 4층 곳곳에 숨겨진 우리 조의 색깔 퍼즐을 찾아요.",
  "찾은 퍼즐을 조원들과 함께 하나의 퍼즐로 완성해요.",
];

const cardClass =
  "pop-card bg-white/95 backdrop-blur-md border-3 sm:border-5 border-black rounded-2xl sm:rounded-3xl p-5 sm:p-10 md:p-14 w-full max-w-5xl relative shadow-pop-xl";
const pillClass =
  "inline-block border-2 sm:border-4 border-black bg-crayon-yellow px-4 sm:px-8 py-1.5 sm:py-2.5 rounded-full font-black text-sm sm:text-xl tracking-wider shadow-pop-sm mb-4 sm:mb-6 -rotate-1";

/**
 * 고은 사랑방 게임 「떡잎유치원 보물찾기 : 우리의 빛을 찾으러 가요」 슬라이드
 * 제목 → 게임 순서 → 규칙 → 7분 타이머 순서로 4장이 이어진다
 */
export default function TreasureHuntSlide({ step }: TreasureHuntSlideProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 z-10 text-center select-none">
      {step === "title" && <TitleCard />}
      {step === "steps" && <StepsCard />}
      {step === "rule" && <RuleCard />}
      {step === "timer" && <TimerCard />}
    </div>
  );
}

// 슬라이드 1: 게임 제목
function TitleCard() {
  return (
    <div className={cardClass}>
      <div className={pillClass}>🎮 고은 사랑방 GAME 🎮</div>
      <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-neutral-900 tracking-tight break-keep drop-shadow-sm">
        떡잎유치원 보물찾기
      </h1>
      <h2 className="mt-3 sm:mt-5 text-2xl sm:text-4xl md:text-5xl font-black text-crayon-pink tracking-tight break-keep drop-shadow-[2px_2px_0px_#000]">
        우리의 빛을 찾으러 가요
      </h2>
      <div className="absolute top-8 right-10 text-crayon-yellow text-4xl animate-pulse">✦</div>
      <div className="absolute bottom-8 left-10 text-crayon-blue text-3xl">✦</div>
      <div className="absolute right-6 bottom-4 w-32 h-32 pointer-events-none hidden md:block">
        <Image src={characterPngs.bo} alt="맹구" width={120} height={120} className="object-contain drop-shadow-md" />
      </div>
      <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full bg-crayon-pink border-4 border-black pointer-events-none" />
    </div>
  );
}

// 슬라이드 2: 게임 순서 안내
function StepsCard() {
  return (
    <div className={cardClass}>
      <div className={pillClass}>📋 게임 순서 안내</div>
      <ol className="space-y-3 sm:space-y-5 text-left">
        {GAME_STEPS.map((text, idx) => (
          <li key={text} className="flex items-start gap-3 sm:gap-5">
            <span className="shrink-0 rounded-xl border-3 border-black bg-crayon-blue px-3 py-1 text-base sm:text-2xl font-black shadow-pop-sm">
              STEP {idx + 1}
            </span>
            <span className="text-lg sm:text-3xl font-black text-neutral-900 break-keep leading-snug">{text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// 슬라이드 3: 게임 규칙
function RuleCard() {
  return (
    <div className={cardClass}>
      <div className={pillClass}>⚠️ 게임 RULE ⚠️</div>
      <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-crayon-red tracking-tight break-keep drop-shadow-[2px_2px_0px_#000]">
        우리 조 색깔만 찾기!
      </h1>
    </div>
  );
}

// 슬라이드 4: 시간 측정 (READY~ START! + 7분 타이머)
function TimerCard() {
  const [timeLeft, setTimeLeft] = useState<number>(TIMER_SECONDS);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 실행 중일 때만 1초마다 줄어들고, 0이 되면 멈추면서 축하 효과를 보여준다
  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsRunning(false);
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  // 마지막 1분은 붉은색으로 긴장감을 준다
  const isLastMinute = timeLeft <= 60 && timeLeft > 0;

  return (
    <div className={cardClass}>
      <div className={pillClass}>⏱ READY~ START! ⏱</div>
      <div
        className={`font-mono font-black tracking-tight text-7xl sm:text-9xl md:text-[10rem] leading-none ${
          isLastMinute ? "text-crayon-red" : "text-neutral-900"
        }`}
      >
        {minutes}:{seconds}
      </div>
      <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3 sm:gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`pop-btn px-6 sm:px-10 py-2.5 sm:py-3.5 text-base sm:text-2xl ${
            isRunning ? "bg-crayon-red text-white hover:bg-red-600" : "bg-crayon-green text-black hover:bg-emerald-400"
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 sm:w-7 sm:h-7" /> 일시정지
            </>
          ) : (
            <>
              <Play className="w-5 h-5 sm:w-7 sm:h-7" /> START 시작
            </>
          )}
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(TIMER_SECONDS);
          }}
          className="pop-btn px-5 sm:px-8 py-2.5 sm:py-3.5 bg-white text-black text-base sm:text-2xl hover:bg-neutral-100"
        >
          <RotateCcw className="w-5 h-5 sm:w-7 sm:h-7" /> 리셋
        </button>
      </div>
    </div>
  );
}
