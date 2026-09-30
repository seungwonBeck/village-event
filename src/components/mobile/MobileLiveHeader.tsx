"use client";

import React from "react";
import { Participant } from "@/types";
import { scheduleList } from "@/data/schedule";
import { Wifi, WifiOff, Sparkles, User } from "lucide-react";

interface MobileLiveHeaderProps {
  participant: Participant | null;
  currentProgramId: string;
  isOnline: boolean;
  onLogout: () => void;
}

/**
 * 모바일 라이브 상단 헤더
 * - 현재 프로그램 표시
 * - 네트워크 연결 상태 (온라인/오프라인)
 * - 참가자 프로필 및 전환
 */
export default function MobileLiveHeader({
  participant,
  currentProgramId,
  isOnline,
  onLogout,
}: MobileLiveHeaderProps) {
  const currentProgram =
    scheduleList.find((p) => p.id === currentProgramId) || scheduleList[0];

  return (
    <div className="flex flex-col gap-2">
      {/* 최상단: 내 정보 & 네트워크 상태 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="pop-tag bg-crayon-yellow text-black text-xs font-black">
            못말리는 령고을 LIVE
          </div>
          {isOnline ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
              <Wifi className="w-3 h-3 text-emerald-600" />
              실시간 연결됨
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full border border-red-300 animate-pulse">
              <WifiOff className="w-3 h-3" />
              오프라인 (재연결 중)
            </span>
          )}
        </div>

        {/* 내 닉네임 칩 */}
        {participant && (
          <div className="flex items-center gap-1.5 shrink-0 max-w-[200px]">
            <span
              className="text-[11px] font-black text-neutral-800 bg-white px-2.5 py-1 rounded-xl border-2 border-black flex items-center gap-1 shadow-pop-sm truncate"
              title={participant.nickname}
            >
              <User className="w-3 h-3 text-crayon-pink shrink-0" />
              <span className="truncate">{participant.nickname}</span>
            </span>
            <button
              onClick={onLogout}
              className="text-[10px] text-neutral-400 hover:text-neutral-700 underline font-bold shrink-0"
            >
              변경
            </button>
          </div>
        )}
      </div>

      {/* 현재 진행 프로그램 알림 배너 */}
      <div className="pop-card bg-crayon-yellow/90 p-3 border-3 border-black flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-crayon-red text-white flex items-center justify-center font-black text-xs shrink-0 shadow-pop-sm">
            NOW
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-neutral-600 block">
              {currentProgram.timeRange}
            </span>
            <h4 className="text-sm font-black text-neutral-900 leading-tight">
              {currentProgram.title}
            </h4>
          </div>
        </div>

        <span className="text-xs font-extrabold text-neutral-700 bg-white/70 px-2.5 py-1 rounded-lg border border-black/20">
          진행 중
        </span>
      </div>
    </div>
  );
}
