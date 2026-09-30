"use client";

import React, { useState, useEffect, useCallback } from "react";
import UiScale from "@/components/ui-scale";
import SlideContainer from "@/components/presentation/SlideContainer";
import IntroSlide from "@/components/presentation/slides/IntroSlide";
import ScheduleSlide from "@/components/presentation/slides/ScheduleSlide";
import TransitionSlide from "@/components/presentation/slides/TransitionSlide";
import RecreationSlide from "@/components/presentation/slides/RecreationSlide";
import WorshipSlide from "@/components/presentation/slides/WorshipSlide";
import MessageSlide from "@/components/presentation/slides/MessageSlide";
import PrayerSlide from "@/components/presentation/slides/PrayerSlide";
import CommunitySlide from "@/components/presentation/slides/CommunitySlide";
import { prayerPlaylist } from "@/data/worship";
import EndingSlide from "@/components/presentation/slides/EndingSlide";
import ReactionOverlay from "@/components/presentation/ReactionOverlay";
import LiveInteractionOverlay from "@/components/presentation/LiveInteractionOverlay";
import { realtimeHub, defaultEventState } from "@/lib/realtime";
import { EventState } from "@/types";

/**
 * 프레젠테이션 메인 페이지 (/presentation)
 * 1920x1080 16:9 해상도 최적화 및 100vw x 100vh 스크롤 없는 슬라이드 시스템
 */
export default function PresentationPage() {
  const [eventState, setEventState] = useState<EventState>(defaultEventState);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // 슬라이드 컴포넌트 목록 (총 12개 기본 슬라이드)
  const slides = [
    <IntroSlide key="intro" />,
    <ScheduleSlide key="schedule" eventState={eventState} />,
    <TransitionSlide key="transition" eventState={eventState} characterSrc="/characters/himawari.png" characterAlt="짱아" />,
    <TransitionSlide key="transition-icebreak" eventState={eventState} programId="opening" titleOverride="조원 인사 & 아이스브레이킹" characterSrc="/characters/cheolsu.png" characterAlt="철수" />,
    <TransitionSlide key="transition-lunch" eventState={eventState} programId="lunch" characterSrc="/characters/maenggu.png" characterAlt="맹구" />,
    <RecreationSlide key="recreation" />,
    <WorshipSlide key="worship" />,
    <MessageSlide key="message" />,
    <PrayerSlide key="prayer" />,
    <WorshipSlide key="prayer-song" playlist={prayerPlaylist} footerLabel="기도회 찬양" />,
    <CommunitySlide key="community" />,
    <EndingSlide key="ending" />,
  ];

  // 찬양 시간에는 가사가 화면을 꽉 채우도록 전체화면 슬라이드로 표시
  const fullBleedSlides = ["worship", "prayer", "prayer-song"];
  const totalSlides = slides.length;

  // 실시간 상태 동기화 구독
  useEffect(() => {
    const initialState = realtimeHub.getEventState();
    setEventState(initialState);
    if (typeof initialState.currentSlideIndex === "number") {
      setCurrentSlide(initialState.currentSlideIndex);
    }

    const unsub = realtimeHub.subscribe("state_changed", (newState: EventState) => {
      setEventState(newState);
      if (typeof newState.currentSlideIndex === "number") {
        setCurrentSlide(newState.currentSlideIndex);
      }
    });

    return () => {
      unsub();
    };
  }, []);

  // 슬라이드 이동 및 상태 브로드캐스트
  const handleJump = useCallback((index: number) => {
    const nextIndex = Math.max(0, Math.min(totalSlides - 1, index));
    setCurrentSlide(nextIndex);
    realtimeHub.updateEventState({ currentSlideIndex: nextIndex });
  }, [totalSlides]);

  const handleNext = useCallback(() => {
    handleJump(currentSlide + 1);
  }, [currentSlide, handleJump]);

  const handlePrev = useCallback(() => {
    handleJump(currentSlide - 1);
  }, [currentSlide, handleJump]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-crayon-bg select-none">
      <UiScale />
      <SlideContainer
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        onNext={handleNext}
        onPrev={handlePrev}
        onJump={handleJump}
        fullBleed={fullBleedSlides.includes(String(slides[currentSlide]?.key))}
      >
        {/* 현재 활성화된 슬라이드 렌더링 */}
        {slides[currentSlide] || slides[0]}
      </SlideContainer>

      {/* 실시간 반응 이모지 플로팅 오버레이 */}
      {eventState.isReactionEnabled && <ReactionOverlay />}

      {/* 실시간 투표 / 퀴즈 / 질문 팝업 오버레이 */}
      <LiveInteractionOverlay eventState={eventState} />
    </div>
  );
}
