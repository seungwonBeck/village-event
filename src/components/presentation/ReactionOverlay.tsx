"use client";

import React, { useEffect, useState } from "react";
import { realtimeHub } from "@/lib/realtime";
import { ReactionEvent } from "@/types";

interface FloatingEmoji {
  id: string;
  emoji: string;
  leftPercent: number; // 10% ~ 90%
}

/**
 * 프로젝터 화면 전체에 참가자들의 실시간 반응(👏 😂 ❤️ 🔥)이
 * 버블처럼 위로 떠오르는 리액션 오버레이 컴포넌트
 */
export default function ReactionOverlay() {
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

  useEffect(() => {
    const unsub = realtimeHub.subscribe("reaction_received", (data: ReactionEvent) => {
      // 랜덤 가로 위치 (15% ~ 85%)
      const leftPercent = Math.floor(Math.random() * 70) + 15;
      const newItem: FloatingEmoji = {
        id: data.id + "_" + Math.random(),
        emoji: data.emoji,
        leftPercent,
      };

      setFloatingEmojis((prev) => [...prev.slice(-25), newItem]);

      // 3.5초 후 화면에서 제거
      setTimeout(() => {
        setFloatingEmojis((prev) => prev.filter((item) => item.id !== newItem.id));
      }, 3500);
    });

    return () => {
      unsub();
    };
  }, []);

  if (floatingEmojis.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {floatingEmojis.map((item) => {
        // Tailwind 클래스 매핑 (인라인 속성 배제)
        const leftClass = getLeftPositionClass(item.leftPercent);

        return (
          <div
            key={item.id}
            className={`absolute bottom-0 text-5xl md:text-6xl animate-float-up drop-shadow-md select-none ${leftClass}`}
          >
            {item.emoji}
          </div>
        );
      })}
    </div>
  );
}

// 인라인 스타일 금지 규칙을 위해 Tailwind 클래스로 변환
function getLeftPositionClass(percent: number): string {
  if (percent < 20) return "left-[15%]";
  if (percent < 30) return "left-[25%]";
  if (percent < 40) return "left-[35%]";
  if (percent < 50) return "left-[45%]";
  if (percent < 60) return "left-[55%]";
  if (percent < 70) return "left-[65%]";
  if (percent < 80) return "left-[75%]";
  return "left-[85%]";
}
