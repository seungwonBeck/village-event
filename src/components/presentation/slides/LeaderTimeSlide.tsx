"use client";

import React from "react";
import Image from "next/image";
import { groups } from "@/data/groups";
import { characterPngs } from "@/components/event-art";

interface LeaderTimeSlideProps {
  // groups.ts의 가장 id (예: "goeun", "sanghee")
  leaderId: string;
}

/**
 * 가장님 게임 타임 슬라이드
 * 게임이 진행되는 동안에는 화면에 "OO 가장님 Time" 제목만 크게 띄운다
 */
export default function LeaderTimeSlide({ leaderId }: LeaderTimeSlideProps) {
  const leader = groups.find((g) => g.id === leaderId);
  // "김고은" -> "고은" (성 제외한 이름만 표기)
  const firstName = leader ? leader.leaderName.slice(1) : "";

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 z-10 text-center select-none">
      <div className="pop-card bg-white/95 backdrop-blur-md border-3 sm:border-5 border-black rounded-2xl sm:rounded-3xl p-5 sm:p-10 md:p-14 max-w-5xl w-full relative shadow-pop-xl">
        <div className="inline-block border-2 sm:border-4 border-black bg-crayon-yellow px-4 sm:px-8 py-1.5 sm:py-2.5 rounded-full font-black text-sm sm:text-xl tracking-wider shadow-pop-sm mb-4 sm:mb-6 -rotate-1">
          🎮 GAME 🎮
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-neutral-900 tracking-tight break-keep drop-shadow-sm">
          {firstName} 가장님
        </h1>
        <h2 className="mt-1 sm:mt-2 text-6xl sm:text-8xl md:text-9xl font-black text-crayon-pink tracking-tight drop-shadow-[2px_2px_0px_#000]">
          Time
        </h2>

        <div className="absolute top-8 right-10 text-crayon-yellow text-4xl animate-pulse">✦</div>
        <div className="absolute bottom-8 left-10 text-crayon-blue text-3xl">✦</div>

        {leader && (
          <div className="absolute right-6 bottom-4 w-36 h-36 pointer-events-none hidden md:block">
            <Image
              src={characterPngs[leader.character]}
              alt={leader.characterName}
              width={130}
              height={130}
              className="object-contain drop-shadow-md"
            />
          </div>
        )}

        <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full bg-crayon-pink border-4 border-black pointer-events-none" />
      </div>
    </div>
  );
}
