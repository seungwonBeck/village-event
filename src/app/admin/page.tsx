"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import UiScale from "@/components/ui-scale";
import { realtimeHub, defaultEventState } from "@/lib/realtime";
import { EventState, Participant, AnonymousQuestion, TeamScore } from "@/types";
import { defaultQuizzes } from "@/data/quiz";
import { scheduleList } from "@/data/schedule";
import {
  Play,
  Pause,
  RotateCcw,
  Users,
  MessageSquare,
  Trophy,
  CheckCircle,
  XCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Settings,
  HelpCircle,
  Plus,
  Minus,
  Sparkles,
} from "lucide-react";

const SLIDE_TITLES = [
  "01 INTRO (행사 안내 & QR)",
  "02 TODAY'S SCHEDULE (시간표)",
  "03 PROGRAM TRANSITION (전환)",
  "04 ICEBREAKING (조원 인사)",
  "05 LUNCH (점심 시간)",
  "06 RECREATION (게임 배틀)",
  "07 WORSHIP (찬양 가사)",
  "08 MESSAGE (말씀 - 세상의 빛)",
  "09 PRAYER (합심 기도)",
  "10 PRAYER WORSHIP (기도회 찬양)",
  "11 COMMUNITY (사랑방 소개)",
  "12 ENDING (마무리 & 사진)",
];

/**
 * 진행자 관리자 대시보드 (/admin)
 * LEFT: 전체 슬라이드 목록 | CENTER: 프로젝터 화면 프리뷰 & 네비 | RIGHT: 라이브 제어 패널
 */
export default function AdminPage() {
  const [eventState, setEventState] = useState<EventState>(defaultEventState);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [questions, setQuestions] = useState<AnonymousQuestion[]>([]);
  const [scores, setScores] = useState<TeamScore[]>([]);

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

  // 슬라이드 점프
  const handleJumpSlide = (index: number) => {
    realtimeHub.updateEventState({ currentSlideIndex: index });
  };

  const handleNextSlide = () => {
    if (eventState.currentSlideIndex < SLIDE_TITLES.length - 1) {
      handleJumpSlide(eventState.currentSlideIndex + 1);
    }
  };

  const handlePrevSlide = () => {
    if (eventState.currentSlideIndex > 0) {
      handleJumpSlide(eventState.currentSlideIndex - 1);
    }
  };

  // 타이머 토글
  const toggleTimer = () => {
    realtimeHub.updateEventState({ isTimerRunning: !eventState.isTimerRunning });
  };

  const resetTimer = () => {
    realtimeHub.updateEventState({ timerSeconds: 600, isTimerRunning: false });
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

  return (
    <div className="flex min-h-screen select-none flex-col bg-neutral-100 lg:h-screen lg:overflow-hidden">
      <UiScale />
      {/* 상단 내비게이션 바 */}
      <header className="bg-white border-b-3 border-black px-6 lg:px-[80px] py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <span className="pop-tag bg-crayon-yellow text-black text-xs font-black">
            ADMIN DASHBOARD
          </span>
          <h1 className="text-xl font-black text-black">
            못말리는 령고을 <span className="text-crayon-pink">진행 컨트롤러</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/content"
            className="pop-btn px-3.5 py-1.5 bg-white text-xs hover:bg-neutral-50"
          >
            <Settings className="w-4 h-4" />
            <span>행사 데이터 편집</span>
          </Link>
          <button
            type="button"
            onClick={async () => {
              await fetch("/api/admin-logout", { method: "POST" });
              window.location.href = "/admin/login";
            }}
            className="pop-btn px-3.5 py-1.5 bg-white text-xs hover:bg-neutral-50"
          >
            로그아웃
          </button>
          <Link
            href="/presentation"
            target="_blank"
            className="pop-btn px-4 py-1.5 bg-crayon-yellow text-xs hover:bg-yellow-300"
          >
            <ExternalLink className="w-4 h-4" />
            <span>프로젝터 새 창 열기</span>
          </Link>
        </div>
      </header>

      {/* 3단 대시보드 레이아웃 */}
      <div className="mx-auto grid w-full max-w-[1920px] flex-1 grid-cols-12 gap-4 p-4 lg:min-h-0 lg:px-[80px]">
        {/* LEFT (3열): 슬라이드 목록 네비게이션 */}
        <div className="col-span-12 lg:col-span-3 pop-card bg-white p-4 border-3 border-black flex flex-col lg:min-h-0 lg:overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black">슬라이드 목록</h3>
            <span className="text-xs font-bold text-neutral-500">
              클릭 시 즉시 전환
            </span>
          </div>

          <div className="flex-1 space-y-1.5 overflow-y-auto px-1 py-1">
            {SLIDE_TITLES.map((title, idx) => {
              const isCurrent = eventState.currentSlideIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleJumpSlide(idx)}
                  className={`w-full text-left px-3 py-2 rounded-2xl border-2 border-black font-bold text-xs transition-all flex items-center justify-between ${
                    isCurrent
                      ? "bg-crayon-yellow font-black ring-2 ring-inset ring-black"
                      : "bg-neutral-50 hover:bg-neutral-100"
                  }`}
                >
                  <span className="truncate">{title}</span>
                  {isCurrent && (
                    <span className="w-2.5 h-2.5 rounded-full bg-crayon-red shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* 현재 진행 프로그램 설정 */}
          <div className="mt-4 pt-4 border-t-2 border-neutral-100">
            <label className="text-xs font-black text-neutral-600 block mb-1">
              현재 진행 프로그램 (NOW 강조)
            </label>
            <select
              value={eventState.currentProgramId}
              onChange={(e) =>
                realtimeHub.updateEventState({ currentProgramId: e.target.value })
              }
              className="w-full p-2 rounded-xl border-2 border-black font-extrabold text-xs bg-white"
            >
              {scheduleList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.timeRange} - {item.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CENTER (5열): 프로젝터 화면 Preview & 슬라이더 컨트롤 */}
        <div className="col-span-12 flex flex-col gap-4 lg:col-span-6 lg:min-h-0 lg:overflow-y-auto">
          <div className="pop-card bg-white p-4 border-3 border-black flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-neutral-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                프로젝터 화면 실시간 미리보기
              </span>
              <span className="font-mono text-xs font-bold">
                슬라이드 {eventState.currentSlideIndex + 1} / {SLIDE_TITLES.length}
              </span>
            </div>

            {/* 프리뷰 프레임 (16:9). 실제 화면을 4배 크기로 그린 뒤 1/4로 줄여 어떤 폭에서도 비율이 깨지지 않음 */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border-3 border-black bg-crayon-bg shadow-pop-sm">
              <iframe
                src="/presentation"
                className="pointer-events-none absolute left-0 top-0 h-[400%] w-[400%] origin-top-left scale-[0.25] border-0"
                title="프로젝터 미리보기"
              />
            </div>
          </div>

          {/* 리모컨: 미리보기와 분리해 크고 누르기 쉽게 */}
          <div className="pop-card border-3 border-black bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-sm font-black">슬라이드 리모컨</span>
              <span className="truncate text-sm font-bold text-neutral-600">
                {SLIDE_TITLES[eventState.currentSlideIndex]}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handlePrevSlide}
                disabled={eventState.currentSlideIndex === 0}
                className="pop-btn h-20 bg-white text-lg disabled:opacity-30"
              >
                <ChevronLeft className="h-6 w-6" /> 이전
              </button>
              <button
                onClick={handleNextSlide}
                disabled={eventState.currentSlideIndex >= SLIDE_TITLES.length - 1}
                className="pop-btn h-20 bg-crayon-yellow text-lg hover:bg-yellow-300 disabled:opacity-30"
              >
                다음 <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* 익명 질문 관리 */}
          <div className="pop-card bg-white p-4 border-3 border-black max-h-56 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-crayon-blue" />
                <h4 className="text-xs font-black">참가자 질문/나눔 관리 ({questions.length})</h4>
              </div>
              <span className="text-[10px] text-neutral-400">승인 시 프로젝터에 노출</span>
            </div>

            {questions.length === 0 ? (
              <p className="text-xs text-neutral-400 py-3 text-center">
                아직 등록된 질문이 없습니다.
              </p>
            ) : (
              <div className="space-y-2">
                {questions.map((q) => (
                  <div
                    key={q.id}
                    className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 flex items-start justify-between gap-2"
                  >
                    <div>
                      <span className="text-[10px] font-black text-neutral-500 block">
                        {q.senderName}
                      </span>
                      <p className="text-xs font-bold text-neutral-900">{q.content}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {q.approved ? (
                        <button
                          onClick={() => handleApproveQuestion(q.id, false)}
                          className="px-2 py-1 rounded bg-neutral-200 text-neutral-700 text-[10px] font-black hover:bg-neutral-300"
                        >
                          숨기기
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApproveQuestion(q.id, true)}
                          className="px-2 py-1 rounded bg-crayon-pink text-white text-[10px] font-black hover:bg-pink-500 shadow-pop-sm"
                        >
                          승인 (화면표시)
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT (4열): 라이브 제어 & 점수판 패널 */}
        <div className="col-span-12 flex flex-col gap-4 lg:col-span-3 lg:min-h-0 lg:overflow-y-auto">
          {/* Live 컨트롤 (참가자 수 & 스위치) */}
          <div className="pop-card bg-white p-4 border-3 border-black">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-crayon-pink" />
                <h4 className="text-xs font-black">실시간 접속 현황</h4>
              </div>
              <span className="pop-tag bg-crayon-blue text-black font-mono font-black text-xs">
                현재 {participants.length}명 참여 중
              </span>
            </div>

            {/* 기능 On/Off 제어 버튼 그룹 */}
            <div className="grid grid-cols-2 gap-2 text-xs font-black">
              <button
                onClick={toggleReaction}
                className={`p-2.5 rounded-xl border-2 border-black transition-all ${
                  eventState.isReactionEnabled
                    ? "bg-crayon-yellow shadow-pop-sm"
                    : "bg-neutral-100 text-neutral-400"
                }`}
              >
                반응 효과: {eventState.isReactionEnabled ? "ON 켜짐" : "OFF 꺼짐"}
              </button>

              <button
                onClick={toggleVote}
                className={`p-2.5 rounded-xl border-2 border-black transition-all ${
                  eventState.isVoteOpen
                    ? "bg-crayon-pink text-white shadow-pop-sm"
                    : "bg-neutral-100 text-neutral-400"
                }`}
              >
                투표/퀴즈: {eventState.isVoteOpen ? "OPEN 공개" : "CLOSED 닫힘"}
              </button>
            </div>
          </div>

          {/* 투표/퀴즈 제어 카드 */}
          <div className="pop-card bg-white p-4 border-3 border-black">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black flex items-center gap-1">
                <HelpCircle className="w-4 h-4 text-crayon-red" />
                진행할 퀴즈/투표 선택
              </span>
            </div>

            <select
              value={eventState.activeQuizId || ""}
              onChange={(e) => handleChangeQuiz(e.target.value)}
              className="w-full p-2 rounded-xl border-2 border-black font-bold text-xs bg-white mb-3"
            >
              {defaultQuizzes.map((q) => (
                <option key={q.id} value={q.id}>
                  [{q.type.toUpperCase()}] {q.question.substring(0, 25)}...
                </option>
              ))}
            </select>

            <button
              onClick={toggleQuizReveal}
              className={`w-full py-2 rounded-xl border-2 border-black font-black text-xs transition-all ${
                eventState.isQuizRevealed
                  ? "bg-emerald-400 text-black"
                  : "bg-neutral-100 hover:bg-neutral-200"
              }`}
            >
              {eventState.isQuizRevealed ? "정답 공개 중 (숨기기)" : "🎉 정답 공개하기"}
            </button>
          </div>

          {/* 팀 점수판 제어 */}
          <div className="pop-card bg-white p-4 border-3 border-black">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-black">팀 점수판 제어</h4>
              </div>
            </div>

            <div className="space-y-2">
              {scores.map((team) => (
                <div
                  key={team.id}
                  className="p-2 rounded-xl border-2 border-black bg-neutral-50 flex items-center justify-between"
                >
                  <span className="text-xs font-black">{team.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-crayon-red">
                      {team.score}점
                    </span>
                    <button
                      onClick={() => handleScoreChange(team.id, -10)}
                      className="w-6 h-6 border border-black rounded bg-white hover:bg-red-50 flex items-center justify-center font-bold text-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleScoreChange(team.id, 10)}
                      className="w-6 h-6 border border-black rounded bg-crayon-yellow hover:bg-yellow-300 flex items-center justify-center font-bold text-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
