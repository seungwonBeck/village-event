"use client";

import React, { useState } from "react";
import { realtimeHub } from "@/lib/realtime";
import { Participant } from "@/types";

interface ReactionPadProps {
  participant: Participant | null;
  isEnabled: boolean;
}

const REACTIONS = [
  { emoji: "👏", label: "박수" },
  { emoji: "😂", label: "웃음" },
  { emoji: "❤️", label: "하트" },
  { emoji: "🔥", label: "열정" },
];

/**
 * 실시간 반응(Reaction) 패드 컴포넌트
 * - 4종 이모지 (👏 😂 ❤️ 🔥)
 * - 연타 어뷰징 방지 쿨다운 적용 (800ms)
 * - 한 손으로 누르기 편한 대형 버튼
 */
export default function ReactionPad({ participant, isEnabled }: ReactionPadProps) {
  const [cooldown, setCooldown] = useState<boolean>(false);
  const [activeEmoji, setActiveEmoji] = useState<string | null>(null);

  const handleSendReaction = (emoji: string) => {
    if (!isEnabled || cooldown || !participant) return;

    // 반응 전송
    realtimeHub.sendReaction(emoji, participant.id);
    setActiveEmoji(emoji);
    setCooldown(true);

    // 0.8초 쿨다운
    setTimeout(() => {
      setCooldown(false);
      setActiveEmoji(null);
    }, 800);
  };

  return (
    <div className="pop-card bg-white p-4 border-3 border-black">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-black text-neutral-600">실시간 반응 보내기</span>
        <span className="text-[10px] font-bold text-neutral-400">
          {isEnabled ? "프로젝터 화면으로 날아갑니다!" : "반응 비활성화됨"}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {REACTIONS.map((item) => {
          const isPressed = activeEmoji === item.emoji;

          return (
            <button
              key={item.emoji}
              onClick={() => handleSendReaction(item.emoji)}
              disabled={!isEnabled || cooldown}
              className={`py-3 rounded-2xl border-3 border-black text-2xl flex flex-col items-center justify-center transition-all ${
                isPressed
                  ? "bg-crayon-yellow scale-95 shadow-pop-sm"
                  : "bg-neutral-50 hover:bg-neutral-100 shadow-pop active:scale-95"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
              title={item.label}
            >
              <span>{item.emoji}</span>
              <span className="text-[10px] font-black text-neutral-600 mt-1">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
