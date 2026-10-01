"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { realtimeHub, defaultEventState } from "@/lib/realtime";
import { EventState, TeamScore } from "@/types";
import { scheduleList } from "@/data/schedule";
import { worshipPlaylist, prayerPlaylist } from "@/data/worship";
import {
  Trophy,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Settings,
  Plus,
  Minus,
} from "lucide-react";

// 슬라이드 바로가기 목록 (번호, 영문 이름, 한글 이름)
const SLIDES = [
  { no: "01", key: "intro", en: "INTRO", ko: "오프닝" },
  { no: "02", key: "schedule", en: "SCHEDULE", ko: "시간표" },
  { no: "03", key: "transition", en: "TRANSITION", ko: "프로그램 전환" },
  { no: "04", key: "icebreak", en: "ICEBREAKING", ko: "조원 인사" },
  { no: "05", key: "jump-game", en: "JUMP GAME", ko: "짱구 점프 게임" },
  { no: "06", key: "lunch", en: "LUNCH", ko: "점심 시간" },
  { no: "07", key: "recreation", en: "RECREATION", ko: "게임 배틀" },
  { no: "08", key: "worship", en: "WORSHIP", ko: "찬양 가사" },
  { no: "09", key: "message", en: "MESSAGE", ko: "말씀 - 세상의 빛" },
  { no: "10", key: "prayer-song", en: "PRAYER WORSHIP", ko: "기도회 찬양" },
  { no: "11", key: "community", en: "COMMUNITY", ko: "사랑방 소개" },
  { no: "12", key: "ending", en: "ENDING", ko: "마무리 & 사진" },
];

const cardClass = "rounded-3xl border-3 border-black bg-white p-4 shadow-pop-sm";

/**
 * 진행자 콘솔 (/admin) - 휴대폰 전용 세로 화면
 * 위에서부터: 지금 슬라이드 → 가사 → 슬라이드 바로가기 → 진행 설정 → 점수, 아래 고정 리모컨
 */
export default function AdminPage() {
  const [eventState, setEventState] = useState<EventState>(defaultEventState);
  const [scores, setScores] = useState<TeamScore[]>([]);
  // 프로젝터 미리보기는 눌렀을 때만 불러와 휴대폰 데이터를 아낀다
  const [showPreview, setShowPreview] = useState<boolean>(false);

  useEffect(() => {
    setEventState(realtimeHub.getEventState());
    setScores(realtimeHub.getScores());

    const unsubState = realtimeHub.subscribe("state_changed", (st: EventState) => {
      setEventState(st);
    });

    const unsubScore = realtimeHub.subscribe("scores_updated", (sc: TeamScore[]) => {
      setScores(sc);
    });

    return () => {
      unsubState();
      unsubScore();
    };
  }, []);

  const lastIndex = SLIDES.length - 1;
  const currentIndex = eventState.currentSlideIndex;

  // 슬라이드 이동
  const handleJumpSlide = (index: number) => {
    realtimeHub.updateEventState({ currentSlideIndex: index });
  };
  const handleNextSlide = () => {
    if (currentIndex < lastIndex) handleJumpSlide(currentIndex + 1);
  };
  const handlePrevSlide = () => {
    if (currentIndex > 0) handleJumpSlide(currentIndex - 1);
  };

  // 점수 증감
  const handleScoreChange = (teamId: string, delta: number) => {
    const updated = realtimeHub.updateScore(teamId, delta);
    setScores([...updated]);
  };

  const current = SLIDES[currentIndex] ?? SLIDES[0];

  // 찬양 / 기도회 찬양 슬라이드일 때: 휴대폰에서 가사를 넘긴다 (프로젝터와 위치 공유)
  const lyricKey = current.key === "worship" || current.key === "prayer-song" ? current.key : null;
  const lyricList = lyricKey === "worship" ? worshipPlaylist : prayerPlaylist;
  const lyricPos = (lyricKey && eventState.lyricPos?.[lyricKey]) || { song: 0, page: 0 };
  const lyricSong = lyricList[lyricPos.song] ?? lyricList[0];
  const lyricPage = lyricSong.slides[lyricPos.page] ?? lyricSong.slides[0];

  const goLyric = (song: number, page: number) => {
    if (!lyricKey) return;
    const cur = realtimeHub.getEventState();
    realtimeHub.updateEventState({ lyricPos: { ...(cur.lyricPos ?? {}), [lyricKey]: { song, page } } });
  };
  const lyricIsFirst = lyricPos.song === 0 && lyricPos.page === 0;
  const lyricIsLast = lyricPos.song === lyricList.length - 1 && lyricPos.page === lyricSong.slides.length - 1;
  const nextLyric = () => {
    if (lyricPos.page < lyricSong.slides.length - 1) goLyric(lyricPos.song, lyricPos.page + 1);
    else if (lyricPos.song < lyricList.length - 1) goLyric(lyricPos.song + 1, 0);
  };
  const prevLyric = () => {
    if (lyricPos.page > 0) goLyric(lyricPos.song, lyricPos.page - 1);
    else if (lyricPos.song > 0) goLyric(lyricPos.song - 1, lyricList[lyricPos.song - 1].slides.length - 1);
  };

  return (
    <div className="min-h-screen select-none bg-neutral-100 pb-32">
      {/* 상단 바 */}
      <header className="sticky top-0 z-30 border-b-3 border-black bg-white px-4 py-3">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <h1 className="text-lg">
            령고을 <span className="text-crayon-pink">진행 콘솔</span>
          </h1>
        </div>
        <div className="mx-auto mt-2 flex max-w-md items-center gap-2 text-sm">
          <Link
            href="/admin/content"
            className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-black bg-white"
          >
            <Settings className="h-4 w-4" />
            데이터 편집
          </Link>
          <Link
            href="/presentation"
            target="_blank"
            className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-black bg-crayon-yellow"
          >
            <ExternalLink className="h-4 w-4" />
            프로젝터 화면
          </Link>
          <button
            type="button"
            onClick={async () => {
              await fetch("/api/admin-logout", { method: "POST" });
              window.location.href = "/admin/login";
            }}
            className="min-h-10 rounded-xl border-2 border-black bg-white px-3"
          >
            로그아웃
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-4 p-4">
        {/* 지금 슬라이드 */}
        <section className={cardClass}>
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-neutral-500">지금 슬라이드</p>
              <h2 className="truncate text-2xl">{current.ko}</h2>
            </div>
            <p className="shrink-0 text-3xl">
              {currentIndex + 1}
              <span className="text-lg text-neutral-400"> / {SLIDES.length}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowPreview((prev) => !prev)}
            className="mt-3 min-h-10 w-full rounded-xl border-2 border-black bg-neutral-50 text-sm"
          >
            {showPreview ? "미리보기 닫기" : "프로젝터 화면 미리보기"}
          </button>
          {showPreview && (
            <div className="relative mt-3 aspect-[16/9] w-full overflow-hidden rounded-2xl border-3 border-black bg-crayon-bg">
              <iframe
                src="/presentation"
                className="pointer-events-none absolute left-0 top-0 h-[400%] w-[400%] origin-top-left scale-[0.25] border-0"
                title="프로젝터 미리보기"
              />
            </div>
          )}
        </section>

        {/* 가사 조작 (찬양 / 기도회 찬양 슬라이드에서만) */}
        {lyricKey && (
          <section className="rounded-3xl border-3 border-black bg-shin-yellow/60 p-4 shadow-pop-sm">
            <h3 className="mb-1 text-lg">가사 넘기기</h3>
            <p className="mb-3 text-sm text-neutral-700">
              {lyricSong.title} · 가사 {lyricPos.page + 1} / {lyricSong.slides.length}
            </p>

            <div className="rounded-2xl border-2 border-black bg-white p-3 text-center text-base leading-snug">
              {lyricPage.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                onClick={prevLyric}
                disabled={lyricIsFirst}
                className="pop-btn h-16 bg-white text-lg disabled:opacity-30"
              >
                <ChevronLeft className="h-6 w-6" /> 이전 가사
              </button>
              <button
                onClick={nextLyric}
                disabled={lyricIsLast}
                className="pop-btn h-16 bg-crayon-pink text-lg text-white disabled:opacity-30"
              >
                다음 가사 <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            <p className="mt-4 mb-2 text-sm text-neutral-700">곡 선택</p>
            <div className="grid grid-cols-2 gap-2">
              {lyricList.map((song, idx) => (
                <button
                  key={song.id}
                  onClick={() => goLyric(idx, 0)}
                  className={`min-h-12 rounded-xl border-2 border-black px-3 py-2 text-left text-sm leading-tight ${
                    lyricPos.song === idx ? "bg-white ring-2 ring-inset ring-black" : "bg-white/60"
                  }`}
                >
                  <span className="block text-xs text-neutral-500">{idx + 1}번</span>
                  <span className="block truncate">{song.title}</span>
                </button>
              ))}
            </div>

            <p className="mt-4 mb-2 text-sm text-neutral-700">이 곡의 가사 바로가기</p>
            <div className="grid grid-cols-1 gap-2">
              {lyricSong.slides.map((slide, idx) => (
                <button
                  key={slide.slideIndex}
                  onClick={() => goLyric(lyricPos.song, idx)}
                  className={`min-h-11 truncate rounded-xl border-2 border-black px-3 py-2 text-left text-sm ${
                    lyricPos.page === idx ? "bg-white ring-2 ring-inset ring-black" : "bg-white/60"
                  }`}
                >
                  {idx + 1}. {slide.lines[0]}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 슬라이드 바로가기 */}
        <section className={cardClass}>
          <h3 className="mb-3 text-lg">슬라이드 바로가기</h3>
          <div className="grid grid-cols-2 gap-2">
            {SLIDES.map((slide, idx) => (
              <button
                key={slide.no}
                onClick={() => handleJumpSlide(idx)}
                className={`min-h-12 rounded-2xl border-2 border-black px-3 py-2 text-left text-sm leading-tight ${
                  currentIndex === idx ? "bg-crayon-yellow ring-2 ring-inset ring-black" : "bg-neutral-50"
                }`}
              >
                <span className="block text-xs text-neutral-500">
                  {slide.no} {slide.en}
                </span>
                <span className="block truncate">{slide.ko}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 진행 설정 */}
        <section className={cardClass}>
          <h3 className="mb-3 text-lg">진행 설정</h3>
          <label htmlFor="current-program" className="mb-1 block text-sm text-neutral-600">
            지금 진행 중인 프로그램
          </label>
          <select
            id="current-program"
            value={eventState.currentProgramId}
            onChange={(e) => realtimeHub.updateEventState({ currentProgramId: e.target.value })}
            className="min-h-12 w-full rounded-xl border-2 border-black bg-white px-3 text-base"
          >
            {scheduleList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.timeRange} - {item.title}
              </option>
            ))}
          </select>

        </section>

        {/* 팀 점수 */}
        <section className={cardClass}>
          <h3 className="mb-3 flex items-center gap-1.5 text-lg">
            <Trophy className="h-5 w-5 text-amber-500" />
            팀 점수
          </h3>
          <div className="space-y-2">
            {scores.map((team) => (
              <div
                key={team.id}
                className="flex items-center justify-between rounded-2xl border-2 border-black bg-neutral-50 px-3 py-2"
              >
                <span className="text-base">{team.name}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleScoreChange(team.id, -10)}
                    aria-label={`${team.name} 10점 빼기`}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-black bg-white"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="w-16 text-center text-xl text-crayon-red">{team.score}점</span>
                  <button
                    onClick={() => handleScoreChange(team.id, 10)}
                    aria-label={`${team.name} 10점 더하기`}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-black bg-crayon-yellow"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* 아래 고정 리모컨: 엄지로 누르기 쉬운 큰 버튼 */}
      <nav
        aria-label="슬라이드 리모컨"
        className="fixed inset-x-0 bottom-0 z-40 border-t-3 border-black bg-white px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      >
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
          <button
            onClick={handlePrevSlide}
            disabled={currentIndex === 0}
            className="pop-btn h-16 bg-white text-xl disabled:opacity-30"
          >
            <ChevronLeft className="h-6 w-6" /> 이전
          </button>
          <button
            onClick={handleNextSlide}
            disabled={currentIndex >= lastIndex}
            className="pop-btn h-16 bg-crayon-yellow text-xl disabled:opacity-30"
          >
            다음 <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </nav>
    </div>
  );
}
