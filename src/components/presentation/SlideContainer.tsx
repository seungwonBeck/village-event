"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Palette,
  Download,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Grid,
  X,
  Check,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export type PresentationTheme =
  | "auto"
  | "toys"
  | "kindergarten"
  | "clean";

interface SlideContainerProps {
  children: React.ReactNode;
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
  onJump: (index: number) => void;
  // 찬양 슬라이드처럼 화면 전체를 꽉 채워 보여줄지 여부
  fullBleed?: boolean;
}

/**
 * 프레젠테이션 전체 슬라이드 메타데이터
 */
export const presentationSlidesInfo = [
  { id: "intro", title: "환영 & 오프닝", badge: "01", icon: "✨", defaultBg: "/images/presentation/bg-kindergarten.jpg" },
  { id: "schedule", title: "행사 타임라인", badge: "02", icon: "⏰", defaultBg: "/images/presentation/frame-toys.jpg" },
  { id: "transition", title: "프로그램 전환", badge: "03", icon: "🚀", defaultBg: "/images/presentation/frame-toys.jpg" },
  { id: "transition-icebreak", title: "조원 인사 & 아이스브레이킹", badge: "04", icon: "🤝", defaultBg: "/images/presentation/frame-toys.jpg" },
  { id: "jump-game", title: "짱구 점프 게임", badge: "05", icon: "🕹️", defaultBg: "/images/presentation/frame-toys.jpg" },
  { id: "transition-lunch", title: "점심 시간", badge: "06", icon: "🍱", defaultBg: "/images/presentation/frame-toys.jpg" },
  { id: "goeun-time", title: "고은 가장님 Time", badge: "07", icon: "🎮", defaultBg: "/images/presentation/frame-toys.jpg" },
  { id: "sanghee-time", title: "상희 가장님 Time", badge: "08", icon: "🎮", defaultBg: "/images/presentation/frame-toys.jpg" },
  { id: "recreation", title: "레크 배틀 & 점수", badge: "09", icon: "🎮", defaultBg: "/images/presentation/frame-toys.jpg" },
  { id: "worship", title: "찬양 & 가사", badge: "10", icon: "🎵", defaultBg: "/images/presentation/bg-kindergarten.jpg" },
  { id: "message", title: "말씀 & 본문", badge: "11", icon: "📖", defaultBg: "/images/presentation/frame-toys.jpg" },
  { id: "prayer-song", title: "기도회 찬양", badge: "12", icon: "🕊️", defaultBg: "/images/presentation/bg-kindergarten.jpg" },
  { id: "community", title: "사랑방 가장 소개", badge: "13", icon: "💛", defaultBg: "/images/presentation/frame-toys.jpg" },
  { id: "ending", title: "엔딩 & 단체사진", badge: "14", icon: "🎉", defaultBg: "/images/presentation/bg-kindergarten.jpg" },
];

/**
 * 다운로드 및 프레젠테이션 테마 템플릿 2종
 */
export const presentationTemplates = [
  {
    id: "toys",
    title: "짱구 장난감 시그니처 프레임",
    subtitle: "참고1 원본 감성 완벽 재현 (16:9)",
    description: "귀여운 공룡, 크레파스, 로봇, 블록이 감싸는 포근한 크림톤 슬라이드",
    src: "/images/presentation/frame-toys.jpg",
    badge: "참고1 시그니처",
    badgeColor: "bg-crayon-yellow text-black",
    recommendedFor: "타임라인, 말씀, 사랑방 소개",
  },
  {
    id: "kindergarten",
    title: "떡잎마을 유치원 오프닝",
    subtitle: "참고2 포스터 무드 16:9 파노라마",
    description: "맑은 하늘과 따사로운 햇살, 떡잎유치원 운동장이 펼쳐지는 생동감 넘치는 타이틀",
    src: "/images/presentation/bg-kindergarten.jpg",
    badge: "참고2 오프닝",
    badgeColor: "bg-crayon-blue text-black",
    recommendedFor: "오프닝 인트로, 엔딩 단체사진",
  },
];

/**
 * 프레젠테이션 컨테이너 컴포넌트
 * - 1920x1080 비율 및 100vw x 100vh 스크롤 없는 전체화면
 * - 스마트 테마 자동 매칭 및 짱구 레퍼런스(참고1, 참고2) 테마 전환
 * - 16:9 PPT 템플릿 갤러리 및 고화질 다운로드 지원
 * - 슬라이드 퀵 내비게이터 드로어
 */
export default function SlideContainer({
  children,
  currentSlide,
  totalSlides,
  onNext,
  onPrev,
  onJump,
  fullBleed = false,
}: SlideContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<PresentationTheme>("auto");
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [showQuickNav, setShowQuickNav] = useState<boolean>(false);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 현재 슬라이드에 따른 배경 이미지 결정
  const getActiveBgImage = useCallback((): string | null => {
    if (themeMode === "clean") return null;
    if (themeMode === "toys") return "/images/presentation/frame-toys.jpg";
    if (themeMode === "kindergarten") return "/images/presentation/bg-kindergarten.jpg";
        
    // auto 모드: 슬라이드별 맞춤 배경 매칭
    const slideMeta = presentationSlidesInfo[currentSlide];
    return slideMeta ? slideMeta.defaultBg : "/images/presentation/frame-toys.jpg";
  }, [themeMode, currentSlide]);

  const activeBg = getActiveBgImage();

  // 마우스 이동 시 컨트롤 보이기 및 타이머 리셋
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      // 모달이 열려있지 않을 때만 숨김
      if (!showThemeModal && !showTemplateModal && !showQuickNav) {
        setShowControls(false);
      }
    }, 3200);
  }, [showThemeModal, showTemplateModal, showQuickNav]);

  // 전체화면 토글 함수
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  // 키보드 이벤트 리스너 등록
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea") {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          onNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          onPrev();
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "Escape":
          if (document.fullscreenElement) {
            document.exitFullscreen?.().catch(() => {});
            setIsFullscreen(false);
          }
          setShowThemeModal(false);
          setShowTemplateModal(false);
          setShowQuickNav(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onNext, onPrev, toggleFullscreen]);

  // 전체화면 상태 동기화
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative isolate w-screen h-screen overflow-x-hidden overflow-y-auto xl:overflow-hidden text-neutral-900 flex flex-col justify-between select-none ${
        "bg-[#FFFBEA]"
      }`}
    >
      {/* 16:9 프레젠테이션 테마 배경 이미지 (전체화면 적용) */}
      {activeBg && (
        <div className="fixed xl:absolute inset-0 pointer-events-none -z-20 overflow-hidden">
          <Image
            src={activeBg}
            alt="프레젠테이션 테마 배경"
            fill
            priority
            className="object-cover select-none"
          />
        </div>
      )}

      {/* 부드러운 배경 앰비언트 그라데이션 오버레이 */}
      {/* 위아래 크림색 그라디언트: 배경 그림 위에서도 글자·캐릭터가 또렷하게 (찬양 슬라이드는 자체 배경을 써서 가려짐) */}
      <div className="fixed xl:absolute inset-0 pointer-events-none -z-10 bg-[linear-gradient(to_bottom,rgba(255,251,234,0.55)_0%,rgba(255,251,234,0.2)_12%,transparent_24%,transparent_78%,rgba(255,251,234,0.2)_90%,rgba(255,251,234,0.55)_100%)]" />

      {/* 메인 슬라이드 콘텐츠 뷰포트 (반응형: 모바일은 스크롤 가능 유연 뷰, 데스크톱은 16:9 비율 유지) */}
      <div
        className={`relative w-full min-h-full xl:h-full flex items-center justify-center ${
          fullBleed ? "p-0" : "p-2 sm:p-4 md:p-6 xl:px-[80px] xl:py-8 pb-24 xl:pb-8"
        }`}
      >
        <div
          className={`w-full min-h-full xl:min-h-0 xl:h-full relative flex flex-col items-center justify-center ${
            fullBleed ? "h-screen" : "max-w-[1920px] xl:max-h-[1080px] xl:aspect-[16/9]"
          }`}
        >
          {children}
        </div>
      </div>

      {/* 마우스 호버 및 모바일 터치 시 나타나는 하단 프레젠테이션 컨트롤러 바 */}
      <div
        className={`fixed xl:absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 scale-[0.8] origin-bottom z-50 transition-opacity duration-300 w-[96%] sm:w-auto max-w-fit ${
          showControls ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="pop-card px-2.5 sm:px-5 py-2 flex items-center justify-center gap-1.5 sm:gap-2.5 bg-white/95 backdrop-blur-md border-3 border-black shadow-pop">
          {/* 이전 슬라이드 버튼 */}
          <button
            onClick={onPrev}
            disabled={currentSlide === 0}
            className="px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs sm:text-sm bg-crayon-yellow hover:bg-yellow-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-pop-sm active:translate-y-0.5 flex items-center gap-1"
            title="이전 슬라이드 (ArrowLeft)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">이전</span>
          </button>

          {/* 슬라이드 퀵 내비게이터 토글 버튼 */}
          <button
            onClick={() => setShowQuickNav(!showQuickNav)}
            className="px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs sm:text-sm bg-white hover:bg-neutral-100 shadow-pop-sm flex items-center gap-1.5"
            title="슬라이드 목록 보기"
          >
            <Grid className="w-3.5 h-3.5 text-crayon-pink" />
            <span className="font-mono">
              <strong className="text-crayon-red">{currentSlide + 1}</strong> / {totalSlides}
            </span>
          </button>

          {/* 다음 슬라이드 버튼 */}
          <button
            onClick={onNext}
            disabled={currentSlide >= totalSlides - 1}
            className="px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs sm:text-sm bg-crayon-blue hover:bg-sky-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-pop-sm active:translate-y-0.5 flex items-center gap-1"
            title="다음 슬라이드 (ArrowRight / Space)"
          >
            <span className="hidden sm:inline">다음</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="w-[2px] h-6 bg-black/20 mx-1 hidden sm:block" />

          {/* 테마 변경 모달 토글 버튼 */}
          <button
            onClick={() => setShowThemeModal(!showThemeModal)}
            className="px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs bg-amber-200 hover:bg-amber-300 shadow-pop-sm active:translate-y-0.5 flex items-center gap-1.5"
            title="프레젠테이션 테마 디자인 선택"
          >
            <Palette className="w-3.5 h-3.5 text-neutral-800" />
            <span className="hidden md:inline">테마 디자인</span>
          </button>

          {/* 템플릿 갤러리 및 다운로드 버튼 */}
          <button
            onClick={() => setShowTemplateModal(true)}
            className="px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs bg-crayon-pink text-white hover:bg-pink-500 shadow-pop-sm active:translate-y-0.5 flex items-center gap-1.5"
            title="16:9 프레젠테이션 템플릿 다운로드"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">PPT 템플릿</span>
          </button>

          {/* 전체화면 토글 버튼 */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl border-2 border-black font-black text-xs bg-neutral-900 text-white hover:bg-neutral-800 shadow-pop-sm active:translate-y-0.5 flex items-center gap-1"
            title="전체화면 (F / Esc)"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden lg:inline">{isFullscreen ? "창모드" : "전체화면"}</span>
          </button>
        </div>
      </div>

      {/* 슬라이드 퀵 점프 목록 오버레이 */}
      {showQuickNav && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="pop-card bg-white p-4 border-4 border-black shadow-pop-xl max-h-80 overflow-y-auto">
            <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-black/10">
              <span className="font-black text-sm text-neutral-900 flex items-center gap-1.5">
                <Grid className="w-4 h-4 text-crayon-pink" />
                슬라이드 바로가기 (총 {totalSlides}장)
              </span>
              <button
                onClick={() => setShowQuickNav(false)}
                className="p-1 hover:bg-neutral-100 rounded-lg text-neutral-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {presentationSlidesInfo.map((info, idx) => (
                <button
                  key={info.id}
                  onClick={() => {
                    onJump(idx);
                    setShowQuickNav(false);
                  }}
                  className={`p-2.5 rounded-xl border-2 text-left font-black text-xs transition-all flex items-center gap-2 ${
                    currentSlide === idx
                      ? "border-black bg-crayon-yellow shadow-pop-sm scale-[1.02]"
                      : "border-neutral-200 bg-neutral-50 hover:bg-white hover:border-black"
                  }`}
                >
                  <span className="text-base">{info.icon}</span>
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-neutral-500 block font-mono">
                      SLIDE {info.badge}
                    </span>
                    <span className="truncate block">{info.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 프레젠테이션 테마 선택 팝업 */}
      {showThemeModal && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="pop-card bg-white p-5 border-4 border-black shadow-pop-xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-black/10">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-crayon-pink" />
                <h3 className="font-black text-base">프레젠테이션 테마 디자인 변경</h3>
              </div>
              <button
                onClick={() => setShowThemeModal(false)}
                className="p-1 hover:bg-neutral-100 rounded-lg text-neutral-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <button
                onClick={() => setThemeMode("auto")}
                className={`p-3 rounded-2xl border-3 text-left font-black text-xs transition-all flex items-start gap-2.5 ${
                  themeMode === "auto"
                    ? "border-black bg-crayon-yellow shadow-pop"
                    : "border-black/20 bg-neutral-50 hover:bg-white"
                }`}
              >
                <Sparkles className="w-4 h-4 text-crayon-red shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    <span>✨ 자동 스마트 테마</span>
                    <span className="px-1.5 py-0.2 bg-black text-white text-[9px] rounded-full">추천</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 font-bold leading-tight">
                    각 슬라이드 분위기에 맞게 2종 디자인 자동 매칭
                  </p>
                </div>
              </button>

              <button
                onClick={() => setThemeMode("toys")}
                className={`p-3 rounded-2xl border-3 text-left font-black text-xs transition-all flex items-start gap-2.5 ${
                  themeMode === "toys"
                    ? "border-black bg-crayon-yellow shadow-pop"
                    : "border-black/20 bg-neutral-50 hover:bg-white"
                }`}
              >
                <Image src="/images/presentation/frame-toys.jpg" alt="" width={96} height={54} className="h-[54px] w-24 shrink-0 rounded-lg border-2 border-black/30 object-cover" />
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    <span>짱구 장난감 프레임</span>
                    <span className="px-1.5 py-0.2 bg-crayon-pink text-white text-[9px] rounded-full">참고1</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 font-bold leading-tight">
                    공룡, 로봇, 크레파스가 감싸는 시그니처 프레임
                  </p>
                </div>
              </button>

              <button
                onClick={() => setThemeMode("kindergarten")}
                className={`p-3 rounded-2xl border-3 text-left font-black text-xs transition-all flex items-start gap-2.5 ${
                  themeMode === "kindergarten"
                    ? "border-black bg-crayon-yellow shadow-pop"
                    : "border-black/20 bg-neutral-50 hover:bg-white"
                }`}
              >
                <Image src="/images/presentation/bg-kindergarten.jpg" alt="" width={96} height={54} className="h-[54px] w-24 shrink-0 rounded-lg border-2 border-black/30 object-cover" />
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    <span>떡잎유치원 운동장</span>
                    <span className="px-1.5 py-0.2 bg-crayon-blue text-black text-[9px] rounded-full">참고2</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 font-bold leading-tight">
                    화창한 햇살과 떡잎유치원 파노라마 무드
                  </p>
                </div>
              </button>

              <button
                onClick={() => setThemeMode("clean")}
                className={`p-3 rounded-2xl border-3 text-left font-black text-xs transition-all flex items-start gap-2.5 ${
                  themeMode === "clean"
                    ? "border-black bg-crayon-yellow shadow-pop"
                    : "border-black/20 bg-neutral-50 hover:bg-white"
                }`}
              >
                <span aria-hidden="true" className="flex h-[54px] w-24 shrink-0 items-center justify-center rounded-lg border-2 border-black/30 bg-[#FFFBEA] text-lg">📄</span>
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    <span>미니멀 페이퍼</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 font-bold leading-tight">
                    배경 그래픽 없이 따뜻한 크림 베이스만 노출
                  </p>
                </div>
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowThemeModal(false)}
                className="px-4 py-1.5 rounded-xl border-2 border-black font-black text-xs bg-neutral-900 text-white hover:bg-neutral-800 shadow-pop-sm"
              >
                확인 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 16:9 슬라이드 디자인 템플릿 갤러리 및 다운로드 모달 */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="pop-card bg-white p-6 md:p-8 border-5 border-black max-w-4xl w-full shadow-pop-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-6 border-b-3 border-black">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crayon-yellow border-2 border-black font-black text-xs shadow-pop-sm mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-crayon-red" />
                  <span>못말리는 령고을 16:9 프레젠테이션 디자인 키트</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-neutral-900">
                  고화질 슬라이드 배경 템플릿 2종 다운로드
                </h2>
                <p className="text-xs md:text-sm text-neutral-600 font-bold mt-1">
                  💡 파워포인트(PPT), Keynote, 미리캔버스, Canva 등에서 슬라이드 배경으로 넣고 바로 발표자료를 제작하실 수 있어요!
                </p>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-2 rounded-2xl border-2 border-black hover:bg-neutral-100 shadow-pop-sm text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 템플릿 그리드 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {presentationTemplates.map((item) => (
                <div
                  key={item.id}
                  className="pop-card bg-amber-50/50 p-4 border-3 border-black flex flex-col justify-between"
                >
                  <div>
                    {/* 16:9 썸네일 미리보기 */}
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border-2 border-black shadow-pop-sm mb-3 group">
                      <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className={`absolute top-2 left-2 px-2.5 py-0.5 rounded-full border border-black text-[11px] font-black shadow-pop-sm ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-neutral-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs font-black text-crayon-pink mb-1.5">
                      {item.subtitle}
                    </p>
                    <p className="text-xs text-neutral-600 font-bold mb-3">
                      {item.description}
                    </p>
                    <div className="inline-block px-2.5 py-1 rounded-lg bg-neutral-200/80 text-[11px] font-bold text-neutral-700 mb-4">
                      🎯 추천 용도: <strong>{item.recommendedFor}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-black/10">
                    <a
                      href={item.src}
                      download={`ryeong-goul-slide-${item.id}.jpg`}
                      className="flex-1 py-2 px-3 rounded-xl border-2 border-black bg-crayon-yellow hover:bg-yellow-300 font-black text-xs text-center shadow-pop-sm active:translate-y-0.5 flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>고화질 원본 다운로드 (16:9)</span>
                    </a>
                    <button
                      onClick={() => {
                        setThemeMode(item.id as PresentationTheme);
                        setShowTemplateModal(false);
                      }}
                      className="py-2 px-3 rounded-xl border-2 border-black bg-white hover:bg-neutral-100 font-black text-xs shadow-pop-sm active:translate-y-0.5"
                      title="이 테마를 현재 프레젠테이션에 즉시 적용"
                    >
                      즉시 적용
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t-2 border-black/10 flex items-center justify-between text-xs font-bold text-neutral-500">
              <span>* 본 템플릿은 1920x1080 와이드 16:9 해상도로 최적화 제작되었습니다.</span>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-5 py-2 rounded-xl border-2 border-black bg-neutral-900 text-white font-black hover:bg-neutral-800 shadow-pop-sm"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
