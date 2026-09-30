"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { realtimeHub, defaultEventState } from "@/lib/realtime";
import { EventState, Participant, AnonymousQuestion, TeamScore } from "@/types";
import { defaultQuizzes } from "@/data/quiz";
import { scheduleList } from "@/data/schedule";
import {
  Users,
  MessageSquare,
  Trophy,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Settings,
  HelpCircle,
  Plus,
  Minus,
} from "lucide-react";

// 슬라이드 바로가기 목록 (번호, 영문 이름, 한글 이름)
const SLIDES = [
  { no: "01", en: "INTRO", ko: "행사 안내 & QR" },
  { no: "02", en: "SCHEDULE", ko: "시간표" },
  { no: "03", en: "TRANSITION", ko: "프로그램 전환" },
  { no: "04", en: "ICEBREAKING", ko: "조원 인사" },
  { no: "05", en: "LUNCH", ko: "점심 시간" },
  { no: "06", en: "RECREATION", ko: "게임 배틀" },
  { no: "07", en: "WORSHIP", ko: "찬양 가사" },
  { no: "08", en: "MESSAGE", ko: "말씀 - 세상의 빛" },
  { no: "09", en: "PRAYER", ko: "합심 기도" },
  { no: "10", en: "PRAYER WORSHIP", ko: "기도회 찬양" },
  { no: "11", en: "COMMUNITY", ko: "사랑방 소개" },
  { no: "12", en: "ENDING", ko: "마무리 & 사진" },
];

const cardClass = "rounded-3xl border-3 border-black bg-white p-4 shadow-pop-sm";

/**
 * 진행자 콘솔 (/admin) - 휴대폰 전용 세로 화면
 * 위에서부터: 지금 슬라이드 → 슬라이드 바로가기 → 진행 설정 → 퀴즈 → 점수 → 질문, 아래 고정 리모컨
 */
export default function AdminPage() {
  const [eventState, setEventState] = useState<EventState>(defaultEventState);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [questions, setQuestions] = useState<AnonymousQuestion[]>([]);
  const [scores, setScores] = useState<TeamScore[]>([]);
  // 프로젝터 미리보기는 눌렀을 때만 불러와 휴대폰 데이터를 아낀다
  const [showPreview, setShowPreview] = useState<boolean>(false);

  useEffect(() => {
    setEventState(realtimeHub.getEventState());
    setParticipants(realtimeHub.getParticipants());
    setQuestions(realtimeHub.getQuestions());
    setScores(realtimeHub.getScores());

    const unsubState = realtimeHub.subscribe("state_changed", (st: EventState) => {
      setEventState(st);
    });

    const unsubPart = realtimeHub.subscribe("participant_joined", (p: Participant) => {
      setParticipants((prev) => [...prev.filter((item) => item.id !== p.id), p]);
    });

    const unsubQ = realtimeHub.subscribe("question_submitted", (q: AnonymousQuestion) => {
      setQuestions((prev) => [...prev, q]);
    });

    const unsubScore = realtimeHub.subscribe("scores_updated", (sc: TeamScore[]) => {
      setScores(sc);
    });

    return () => {
      unsubState();
      unsubPart();
      unsubQ();
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

  // 반응(Reaction) 토글
  const toggleReaction = () => {
    realtimeHub.updateEventState({ isReactionEnabled: !eventState.isReactionEnabled });
  };

  // 투표/퀴즈 오픈 토글
  const toggleVote = () => {
    realtimeHub.updateEventState({ isVoteOpen: !eventState.isVoteOpen });
  };

  // 퀴즈 정답 공개 토글
  const toggleQuizReveal = () => {
    realtimeHub.updateEventState({ isQuizRevealed: !eventState.isQuizRevealed });
  };

  // 활성 퀴즈 변경
  const handleChangeQuiz = (quizId: string) => {
    realtimeHub.updateEventState({
      activeQuizId: quizId,
      isQuizRevealed: false,
    });
  };

  // 질문 승인/미승인 토글
  const handleApproveQuestion = (qId: string, approved: boolean) => {
    realtimeHub.approveQuestion(qId, approved);
    setQuestions([...realtimeHub.getQuestions()]);
  };

  // 점수 증감
  const handleScoreChange = (teamId: string, delta: number) => {
    const updated = realtimeHub.updateScore(teamId, delta);
    setScores([...updated]);
  };

  const current = SLIDES[currentIndex] ?? SLIDES[0];

  return (
    <div className="min-h-screen select-none bg-neutral-100 pb-32">
      {/* 상단 바 */}
      <header className="sticky top-0 z-30 border-b-3 border-black bg-white px-4 py-3">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <h1 className="text-lg">
            령고을 <span className="text-crayon-pink">진행 콘솔</span>
          </h1>
          <span className="flex items-center gap-1.5 rounded-full border-2 border-black bg-crayon-blue px-3 py-1 text-sm">
            <Users className="h-4 w-4" />
            {participants.length}명
          </span>
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

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={toggleReaction}
              className={`min-h-14 rounded-xl border-2 border-black px-2 text-sm ${
                eventState.isReactionEnabled ? "bg-crayon-yellow" : "bg-neutral-100 text-neutral-400"
              }`}
            >
              반응 효과
              <span className="block text-base">{eventState.isReactionEnabled ? "켜짐" : "꺼짐"}</span>
            </button>
            <button
              onClick={toggleVote}
              className={`min-h-14 rounded-xl border-2 border-black px-2 text-sm ${
                eventState.isVoteOpen ? "bg-crayon-pink text-white" : "bg-neutral-100 text-neutral-400"
              }`}
            >
              투표/퀴즈
              <span className="block text-base">{eventState.isVoteOpen ? "공개" : "닫힘"}</span>
            </button>
          </div>
        </section>

        {/* 퀴즈 */}
        <section className={cardClass}>
          <h3 className="mb-3 flex items-center gap-1.5 text-lg">
            <HelpCircle className="h-5 w-5 text-crayon-red" />
            퀴즈 / 투표
          </h3>
          <label htmlFor="active-quiz" className="sr-only">
            진행할 퀴즈 선택
          </label>
          <select
            id="active-quiz"
            value={eventState.activeQuizId || ""}
            onChange={(e) => handleChangeQuiz(e.target.value)}
            className="min-h-12 w-full rounded-xl border-2 border-black bg-white px-3 text-base"
          >
            {defaultQuizzes.map((q) => (
              <option key={q.id} value={q.id}>
                [{q.type.toUpperCase()}] {q.question.substring(0, 22)}...
              </option>
            ))}
          </select>
          <button
            onClick={toggleQuizReveal}
            className={`mt-3 min-h-12 w-full rounded-xl border-2 border-black text-base ${
              eventState.isQuizRevealed ? "bg-emerald-400" : "bg-neutral-100"
            }`}
          >
            {eventState.isQuizRevealed ? "정답 공개 중 (누르면 숨김)" : "정답 공개하기"}
          </button>
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

        {/* 참가자 질문 */}
        <section className={cardClass}>
          <h3 className="mb-1 flex items-center gap-1.5 text-lg">
            <MessageSquare className="h-5 w-5 text-crayon-blue" />
            참가자 질문 ({questions.length})
          </h3>
          <p className="mb-3 text-sm text-neutral-500">승인하면 프로젝터에 나와요.</p>
          {questions.length === 0 ? (
            <p className="py-3 text-center text-sm text-neutral-400">아직 등록된 질문이 없어요.</p>
          ) : (
            <div className="space-y-2">
              {questions.map((q) => (
                <div key={q.id} className="rounded-2xl border border-neutral-300 bg-neutral-50 p-3">
                  <span className="block text-xs text-neutral-500">{q.senderName}</span>
                  <p className="mt-0.5 text-base">{q.content}</p>
                  <button
                    onClick={() => handleApproveQuestion(q.id, !q.approved)}
                    className={`mt-2 min-h-11 w-full rounded-xl border-2 border-black text-sm ${
                      q.approved ? "bg-neutral-200" : "bg-crayon-pink text-white"
                    }`}
                  >
                    {q.approved ? "숨기기" : "승인 (화면에 표시)"}
                  </button>
                </div>
              ))}
            </div>
          )}
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
