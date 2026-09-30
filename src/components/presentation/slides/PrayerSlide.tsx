"use client";

import React, { useState, useEffect } from "react";
import { event } from "@/data/event";
import { defaultPrayerTopics, PrayerTopic } from "@/data/prayer";
import { realtimeHub } from "@/lib/realtime";
import { EventState } from "@/types";

/**
 * 08 PRAYER SLIDE
 * 차분하고 진지한 톤: 어두운 배경 위에 선택한 기도 제목 하나를 중앙에 크게 보여준다.
 */
export default function PrayerSlide() {
  const [topics, setTopics] = useState<PrayerTopic[]>(defaultPrayerTopics);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  // 선택한 기도 제목 번호를 휴대폰 콘솔과 공유
  useEffect(() => {
    const apply = (st: EventState) => {
      if (typeof st.prayerTopicIndex === "number") setSelectedIdx(st.prayerTopicIndex);
    };
    apply(realtimeHub.getEventState());
    return realtimeHub.subscribe("state_changed", apply);
  }, []);

  const selectTopic = (idx: number) => {
    setSelectedIdx(idx);
    realtimeHub.updateEventState({ prayerTopicIndex: idx });
  };

  useEffect(() => {
    // 로컬스토리지에 저장된 커스텀 기도 제목이 있다면 불러오기
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ryeong_prayer_topics");
      if (saved) {
        try {
          setTopics(JSON.parse(saved));
        } catch {
          // 기본값 사용
        }
      }
    }
  }, []);

  const current = topics[selectedIdx] ?? topics[0];
  const isFirst = selectedIdx === 0;
  const isLast = selectedIdx >= topics.length - 1;

  // 방향키/스페이스로 기도 제목 넘기기. 첫 제목의 ←, 마지막 제목의 →는 슬라이드 이동에 양보한다
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      if ((e.key === "ArrowRight" || e.key === " ") && !isLast) {
        e.preventDefault();
        e.stopImmediatePropagation();
        selectTopic(selectedIdx + 1);
      } else if (e.key === "ArrowLeft" && !isFirst) {
        e.preventDefault();
        e.stopImmediatePropagation();
        selectTopic(selectedIdx - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isFirst, isLast, selectedIdx]);

  if (!current) return null;

  return (
    <div className="relative isolate flex h-full w-full select-none flex-col justify-between gap-6 bg-[#000000]/60 px-6 pt-6 pb-28 text-white [container-type:inline-size] sm:px-12 sm:pt-8 sm:pb-28 md:px-[80px] xl:pb-8">
      {/* 상단: 행사 라벨 + 기도 제목 선택 */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <span className="text-sm text-white/70 sm:text-base">{event.eventLabel}</span>

        <div className="flex flex-wrap items-center gap-2">
          {topics.map((topic, idx) => (
            <button
              key={topic.id}
              onClick={() => selectTopic(idx)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors sm:text-base ${
                selectedIdx === idx
                  ? "border-white bg-white text-neutral-900"
                  : "border-white/30 bg-white/5 text-white/70 hover:bg-white/15"
              }`}
            >
              기도 {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* 중앙: 선택한 기도 제목을 크게 */}
      <div className="my-auto flex flex-col items-center px-2 text-center">
        <p className="text-[max(1rem,1.6cqw)] text-white/70">
          기도 {selectedIdx + 1} · {current.category}
          {current.bibleRef && <span className="ml-3 text-white/50">{current.bibleRef}</span>}
        </p>
        <h2 className="mt-[2cqw] max-w-[90%] text-[max(2rem,4.4cqw)] leading-[1.3] text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.7)]">
          {current.title}
        </h2>
        <p className="mt-[2.4cqw] max-w-[78%] text-[max(1.2rem,2.3cqw)] leading-[1.6] text-white/85">
          {current.description}
        </p>
      </div>

      {/* 하단 안내 */}
      <div className="flex items-center justify-between gap-3 border-t border-white/15 pt-3 text-xs text-white/40 sm:text-sm">
        <span>각 기도 제목마다 충분한 시간을 갖고 다 함께 소리 내어 기도합니다.</span>
        <span>
          {selectedIdx + 1} / {topics.length}
        </span>
      </div>
    </div>
  );
}
