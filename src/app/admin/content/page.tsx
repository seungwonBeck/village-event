"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { event, EventInfo } from "@/data/event";
import { groups, GroupItem } from "@/data/groups";
import { defaultPrayerTopics, PrayerTopic } from "@/data/prayer";
import { ArrowLeft, Save, Sparkles, CheckCircle2, User, Church } from "lucide-react";

/**
 * 행사 데이터 편집 페이지 (/admin/content)
 * 설교자, 사랑방, 기도 제목 등을 실시간으로 편집하여 저장할 수 있습니다.
 */
export default function AdminContentPage() {
  const [eventData, setEventData] = useState<EventInfo>(event);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ryeong_event_custom");
      if (saved) {
        try {
          setEventData({ ...event, ...JSON.parse(saved) });
        } catch {
          // 기본값 사용
        }
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("ryeong_event_custom", JSON.stringify(eventData));
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-neutral-100 p-4 select-none">
      <div className="max-w-3xl mx-auto">
        {/* 상단 내비게이션 */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/admin"
            className="pop-btn px-4 py-2 bg-white text-xs hover:bg-neutral-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>관리자 대시보드로 돌아가기</span>
          </Link>
          <span className="pop-tag bg-crayon-pink text-white text-xs">
            DATA EDITOR
          </span>
        </div>

        <div className="pop-card bg-white p-8 border-4 border-black">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black">행사 기본 데이터 편집</h2>
              <p className="text-xs font-bold text-neutral-500 mt-1">
                수정된 정보는 프레젠테이션 및 모바일 화면에 즉시 적용됩니다.
              </p>
            </div>
            {savedSuccess && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-black text-xs border border-emerald-300">
                <CheckCircle2 className="w-4 h-4" /> 저장 완료!
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* 행사 기본명 및 부서 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-neutral-700 mb-1">
                  행사 타이틀
                </label>
                <input
                  type="text"
                  value={eventData.title}
                  onChange={(e) =>
                    setEventData({ ...eventData, title: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border-2 border-black font-extrabold text-sm bg-neutral-50"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-neutral-700 mb-1">
                  주최 부서
                </label>
                <input
                  type="text"
                  value={eventData.ministry}
                  onChange={(e) =>
                    setEventData({ ...eventData, ministry: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border-2 border-black font-extrabold text-sm bg-neutral-50"
                />
              </div>
            </div>

            {/* 설교자 / 말씀 인도자 입력 (TODO 해결!) */}
            <div className="bg-amber-50 p-4 rounded-2xl border-2 border-dashed border-amber-300">
              <label className="block text-xs font-black text-amber-900 mb-1 flex items-center gap-1">
                <User className="w-4 h-4 text-crayon-red" />
                <span>말씀 인도자 / 설교자 (확정 후 입력)</span>
              </label>
              <input
                type="text"
                value={eventData.speaker}
                onChange={(e) =>
                  setEventData({ ...eventData, speaker: e.target.value })
                }
                placeholder="예: 김동신 목사, 이아포슬 전도사"
                className="w-full p-2.5 rounded-xl border-2 border-black font-extrabold text-sm bg-white"
              />
              <span className="text-[11px] font-bold text-amber-700 mt-1 block">
                * 입력 시 말씀 슬라이드(06 MESSAGE)에 자동으로 이름이 반영됩니다.
              </span>
            </div>

            {/* 일시 및 장소 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-neutral-700 mb-1">
                  행사 일시
                </label>
                <input
                  type="text"
                  value={eventData.displayDate}
                  onChange={(e) =>
                    setEventData({ ...eventData, displayDate: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border-2 border-black font-extrabold text-sm bg-neutral-50"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-neutral-700 mb-1">
                  행사 장소
                </label>
                <input
                  type="text"
                  value={eventData.location}
                  onChange={(e) =>
                    setEventData({ ...eventData, location: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border-2 border-black font-extrabold text-sm bg-neutral-50"
                />
              </div>
            </div>

            {/* 주제 말씀 */}
            <div>
              <label className="block text-xs font-black text-neutral-700 mb-1">
                주제 말씀 (성경 구절)
              </label>
              <input
                type="text"
                value={eventData.bibleVerse}
                onChange={(e) =>
                  setEventData({ ...eventData, bibleVerse: e.target.value })
                }
                className="w-full p-2.5 rounded-xl border-2 border-black font-extrabold text-sm bg-neutral-50 mb-2"
              />
              <textarea
                value={eventData.themeVerseContent}
                onChange={(e) =>
                  setEventData({
                    ...eventData,
                    themeVerseContent: e.target.value,
                  })
                }
                rows={2}
                className="w-full p-2.5 rounded-xl border-2 border-black font-bold text-xs bg-neutral-50"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl border-3 border-black bg-crayon-yellow text-black font-black text-base shadow-pop hover:bg-yellow-300 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>변경 사항 저장하기</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
