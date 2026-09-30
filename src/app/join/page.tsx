"use client";

import UiScale from "@/components/ui-scale";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { event } from "@/data/event";
import { realtimeHub } from "@/lib/realtime";
import { ArrowRight, User, Sparkles } from "lucide-react";

/**
 * 참가자 입장 페이지 (/join)
 * 예시 형식: 000사랑방/00또래/000
 */
export default function JoinPage() {
  const [entryString, setEntryString] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    // 기존 참가 정보가 있으면 기본 세팅
    if (typeof window !== "undefined") {
      const existing = realtimeHub.getMyParticipant();
      if (existing && existing.nickname) {
        setEntryString(existing.nickname);
      }
    }
  }, []);

  const handleJoin = (targetNickname?: string) => {
    const raw = targetNickname !== undefined ? targetNickname : entryString;
    const trimmed = raw.trim();

    if (!trimmed) {
      setErrorMsg("입장 정보를 입력해주세요! 예: 000사랑방/00또래/000");
      return;
    }

    // 1) 로컬스토리지 및 실시간 버스에 참가자 등록
    const participant = realtimeHub.registerParticipant(trimmed);

    // 2) 확실한 브라우저 이동 (쿼리스트링 전달로 인앱 브라우저/쿠키 제한 환경까지 100% 지원)
    const targetUrl = `/live?nickname=${encodeURIComponent(trimmed)}&id=${participant.id}`;
    window.location.href = targetUrl;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleJoin();
  };

  // 예시 빠른 입력 칩 클릭 시 즉시 입력창 반영
  const handleApplyPreset = (preset: string) => {
    setEntryString(preset);
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between p-4 sm:p-6 max-w-md mx-auto select-none">
      <UiScale mode="compact" />
      {/* 상단 뱃지 & 행사명 */}
      <div className="flex flex-col items-center text-center mt-3">
        <div className="pop-tag bg-crayon-pink text-white text-xs px-4 py-1 mb-2 shadow-pop-sm rotate-[-1deg]">
          ✨ {event.church} {event.ministry} ✨
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-neutral-800 tracking-tight">
          못말리는 <span className="text-crayon-red">령고을</span> 입장
        </h2>
      </div>

      {/* 중앙 메인 카드 */}
      <div className="my-auto pop-card bg-white p-6 sm:p-7 border-4 border-black relative shadow-pop-lg">
        {/* 상단 짱구 원형 아이콘 */}
        <div className="flex justify-center -mt-16 mb-3">
          <div className="w-24 h-24 rounded-full border-4 border-black bg-crayon-yellow flex items-center justify-center shadow-pop">
            <Image
              src="/characters/shinchan.png"
              alt="짱구"
              width={75}
              height={75}
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="text-center mb-5">
          <h3 className="text-xl font-black text-neutral-900">
            참가자 입장하기
          </h3>
          <p className="text-xs font-bold text-neutral-600 mt-1">
            닉네임이나 사랑방 정보를 적고 입장 버튼을 눌러주세요!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black text-neutral-800">
                입력 예시: <span className="text-crayon-red">예)000사랑방 00또래 000</span>
              </label>
              <span className="text-[10px] font-bold text-neutral-500">
                자유 형식 입력
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={entryString}
                onChange={(e) => {
                  setEntryString(e.target.value);
                  setErrorMsg("");
                }}
                placeholder="예)000사랑방 00또래 000"
                maxLength={50}
                className="w-full px-4 py-3.5 rounded-2xl border-3 border-black text-sm sm:text-base font-extrabold focus:outline-none focus:ring-4 focus:ring-crayon-pink bg-neutral-50 shadow-pop-sm placeholder:text-neutral-400"
                autoFocus
              />
              <User className="w-5 h-5 text-neutral-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {errorMsg ? (
              <p className="mt-1.5 text-xs font-black text-crayon-red">{errorMsg}</p>
            ) : (
              <p className="mt-1.5 text-[11px] font-bold text-neutral-600">
                👉 예시: <strong className="text-black">예)홍평안사랑방 97또래 홍길동</strong>
              </p>
            )}
          </div>

          {/* 빠른 예시 선택 칩 (터치 한 번으로 형식 완성!) */}
          <div className="bg-amber-50/90 p-3 rounded-2xl border-2 border-dashed border-amber-300">
            <span className="text-[11px] font-black text-amber-900 flex items-center gap-1 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>터치하여 예시 적용하기:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                "홍평안사랑방/97또래/000",
                "양혜선사랑방/98또래/000",
                "백승원사랑방/99또래/000",
                "이상희사랑방/00또래/000",
                "김고은사랑방/01또래/000",
              ].map((sample, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => handleApplyPreset(sample)}
                  className="px-2.5 py-1 rounded-xl border border-black/40 bg-white text-[10px] font-bold hover:bg-crayon-yellow hover:border-black transition-all shadow-pop-sm"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleJoin()}
            className="w-full py-4 rounded-2xl border-3 border-black bg-crayon-yellow text-black font-black text-lg shadow-pop hover:bg-yellow-300 active:translate-y-0.5 active:shadow-pop-sm flex items-center justify-center gap-2 transition-transform cursor-pointer"
          >
            <span>지금 바로 입장하기</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* 하단 안내 */}
      <div className="text-center text-xs font-bold text-neutral-500 mb-2">
        {event.displayDate} • {event.location}
      </div>
    </div>
  );
}
