"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { event } from "@/data/event";
import confetti from "canvas-confetti";
import { Sparkles, Heart, PartyPopper } from "lucide-react";

/**
 * 09 ENDING SLIDE
 * 엔딩 인사 및 단체사진 슬라이드
 */
export default function EndingSlide() {
  // 슬라이드 진입 시 축하 콘페티 실행
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
    });
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.5 },
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between py-3 px-3 sm:py-5 sm:px-8 md:px-12 z-10 text-center select-none gap-4 sm:gap-6">
      {/* 상단 서브 타이틀 */}
      <div className="inline-flex items-center gap-1.5 sm:gap-2 pop-tag bg-crayon-pink text-white text-xs sm:text-sm px-4 sm:px-5 py-1 sm:py-1.5 rotate-[-1deg]">
        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span>{event.eventLabel}</span>
      </div>

      {/* 중앙 메인 카피 영역 */}
      <div className="my-auto flex flex-col items-center max-w-4xl w-full">
        <div className="plate mb-4 px-6 py-3 sm:mb-6">
        <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-neutral-800 mb-1 sm:mb-2">
          은혜와 감사가 넘쳤던 우리들의 하루!
        </h2>
        <h1 className="text-3xl sm:text-5xl md:text-5xl lg:text-5xl font-black text-crayon-text tracking-tight sm:tracking-tight mb-4 sm:mb-6">
          오늘도 <span className="bg-crayon-yellow px-2 sm:px-4 py-0.5 sm:py-1 border-2 sm:border-4 border-black rounded-2xl sm:rounded-3xl shadow-pop inline-block">못말리는</span> 령고을!
        </h1>
        </div>

        {/* 단체사진 또는 캐릭터 집합 카드 */}
        <div className="pop-card bg-white p-3.5 sm:p-4 border-3 sm:border-5 border-black max-w-xl w-full shadow-pop-xl relative overflow-hidden group">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border-2 border-black/30">
            {/* 떡잎유치원 운동장 배경 위에 친구들이 나란히 앉아 있는 모습 */}
            <Image
              src="/images/event/courtyard.png"
              alt=""
              aria-hidden="true"
              fill
              className="object-cover"
            />
            <Image
              src="/images/event/group-photo.png"
              alt="령고을 단체 사진"
              width={1445}
              height={717}
              className="absolute bottom-[-2%] left-1/2 h-auto w-[90%] -translate-x-1/2 drop-shadow-[0_6px_6px_rgba(58,42,30,0.35)]"
            />
          </div>

          <p className="mt-3 sm:mt-4 text-xs sm:text-lg font-black text-neutral-800 flex items-center justify-center gap-1.5 sm:gap-2">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-crayon-red fill-crayon-red" />
            <span>{event.church} {event.ministry} 사랑합니다! 축복합니다!</span>
          </p>
        </div>

        {/* 축하 폭죽 버튼 */}
        <button
          onClick={triggerConfetti}
          className="mt-3 sm:mt-4 pop-btn px-5 sm:px-6 py-2 sm:py-2.5 bg-crayon-yellow text-black text-xs sm:text-sm hover:bg-yellow-300 active:scale-95"
        >
          <PartyPopper className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-crayon-red" />
          <span>축하 폭죽 터뜨리기! 🎉</span>
        </button>
      </div>

      {/* 하단 안녕 인사 카피 */}
      <div className="plate px-4 py-1.5 text-xs font-black text-neutral-700 sm:text-sm">
        다음 령고을에서 또 만나요 안녕~ 👋✨
      </div>
    </div>
  );
}
