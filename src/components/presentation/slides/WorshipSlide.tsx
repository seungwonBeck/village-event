"use client";

import React, { useState, useEffect } from "react";
import { worshipPlaylist, WorshipSong, SongSlide } from "@/data/worship";
import { event } from "@/data/event";
import { Music, ChevronLeft, ChevronRight, Disc } from "lucide-react";

interface WorshipSlideProps {
  playlist?: WorshipSong[];
  footerLabel?: string;
}

/**
 * 05 WORSHIP SLIDE
 * 프로젝터 가독성 최우선: 차분하고 어두운 배경 + 대형 2~4줄 중앙 정렬 가사
 */
export default function WorshipSlide({
  playlist = worshipPlaylist,
  footerLabel = `${event.ministry} 찬양 콘티`,
}: WorshipSlideProps) {
  const [songIndex, setSongIndex] = useState<number>(0);
  const [slideIndex, setSlideIndex] = useState<number>(0);

  const currentSong: WorshipSong = playlist[songIndex] || playlist[0];
  const totalSlides = currentSong.slides.length;
  const currentSlide: SongSlide = currentSong.slides[slideIndex] || currentSong.slides[0];

  const isFirst = songIndex === 0 && slideIndex === 0;
  const isLast = songIndex === playlist.length - 1 && slideIndex === totalSlides - 1;

  // 가사 이전/다음 핸들러
  const handleNextSlide = () => {
    if (slideIndex < totalSlides - 1) {
      setSlideIndex(slideIndex + 1);
    } else if (songIndex < playlist.length - 1) {
      setSongIndex(songIndex + 1);
      setSlideIndex(0);
    }
  };

  const handlePrevSlide = () => {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    } else if (songIndex > 0) {
      // 이전 곡의 마지막 가사로 이동
      setSlideIndex(playlist[songIndex - 1].slides.length - 1);
      setSongIndex(songIndex - 1);
    }
  };

  // 방향키/스페이스로 가사 넘기기. 첫 가사의 ←, 마지막 가사의 →는 슬라이드 이동에 양보한다
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      const isNextKey = e.key === "ArrowRight" || e.key === " ";
      if (isNextKey && !isLast) {
        e.preventDefault();
        e.stopImmediatePropagation();
        handleNextSlide();
      } else if (e.key === "ArrowLeft" && !isFirst) {
        e.preventDefault();
        e.stopImmediatePropagation();
        handlePrevSlide();
      }
    };
    // 캡처 단계에서 먼저 받아야 슬라이드 컨테이너의 단축키보다 앞선다
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  });

  return (
    <div className="holy-bg relative isolate flex h-full w-full select-none flex-col justify-between gap-4 overflow-hidden px-5 py-5 text-white [container-type:inline-size] sm:px-12 sm:py-8 md:px-16">
      {/* 위아래 검정 그라디언트: 가사가 배경에 묻히지 않게 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.35)_24%,transparent_40%,transparent_60%,rgba(0,0,0,0.35)_76%,rgba(0,0,0,0.9)_100%)]"
      />

      {/* 상단: 곡 정보 & 곡 선택 번호 */}
      <div className="z-10 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        {/* 왼쪽 상단: 곡 정보를 한 줄로 (유일하게 또렷한 글자) */}
        <h3 className="flex min-w-0 items-center gap-6 whitespace-nowrap text-[max(1rem,1.5cqw)] leading-tight text-white/90">
          <Music className="h-5 w-5 shrink-0" />
          <span className="truncate">{currentSong.title}</span>
          <span className="shrink-0 text-[max(0.75rem,0.95cqw)] text-white/60">{currentSong.artist}</span>
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          {playlist.map((song, idx) => (
            <button
              key={song.id}
              onClick={() => {
                setSongIndex(idx);
                setSlideIndex(0);
              }}
              title={song.title}
              aria-label={`${idx + 1}번 곡 ${song.title}`}
              className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm transition-colors sm:h-9 sm:w-9 sm:text-base ${
                songIndex === idx
                  ? "border-white/40 bg-white/25 text-white/70"
                  : "border-white/15 bg-white/5 text-white/35 hover:bg-white/15"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* 중앙: 가사 (화면 폭에 비례해 크게) */}
      <div className="z-10 my-auto flex flex-col items-center justify-center px-2 text-center">
        <div className="max-w-[92%] space-y-[1.6cqw]">
          {currentSlide.lines.map((line, lIdx) => (
            <p
              key={lIdx}
              className="!font-extrabold text-[max(2.2rem,6.2cqw)] leading-[1.25] tracking-tight text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.6)]"
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* 가사 네비게이션(테스트): 지금 곡의 가사 화면으로 바로 이동 */}
      <div className="z-10 flex flex-wrap items-center justify-center gap-2">
        {currentSong.slides.map((slide, idx) => (
          <button
            key={slide.slideIndex}
            onClick={() => setSlideIndex(idx)}
            title={slide.lines.join(" ")}
            className={`max-w-[14rem] truncate rounded-full border px-3 py-1 text-[max(0.75rem,0.95cqw)] transition-colors ${
              slideIndex === idx
                ? "border-white/70 bg-white/25 text-white"
                : "border-white/15 bg-white/5 text-white/40 hover:bg-white/15"
            }`}
          >
            {idx + 1}. {slide.lines[0]}
          </button>
        ))}
      </div>

      {/* 하단: 진행도 & 넘김 버튼 (멀리서도 보이게 크게) */}
      <div className="z-10 flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-[max(0.8rem,1.05cqw)] text-white/30 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <Disc className="h-4 w-4 animate-spin text-white/30 motion-reduce:animate-none" />
          <span>{footerLabel}</span>
        </div>

        {/* 우측 하단: 곡/가사 진행도 + 클릭으로 넘기는 버튼 (방향키·스페이스도 가능) */}
        <div className="flex items-center gap-4">
          <span className="tracking-wider">
            곡 <span className="text-white/50">{songIndex + 1}</span> / {playlist.length}
            <span className="mx-3 text-white/20">|</span>
            가사 <span className="text-white/50">{slideIndex + 1}</span> / {totalSlides}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevSlide}
              disabled={isFirst}
              className="rounded-xl bg-white/5 p-2 text-white/40 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-20"
              title="이전 가사"
              aria-label="이전 가사"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNextSlide}
              disabled={isLast}
              className="rounded-xl bg-white/10 p-2 text-white/50 transition-colors hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-20"
              title="다음 가사"
              aria-label="다음 가사"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
