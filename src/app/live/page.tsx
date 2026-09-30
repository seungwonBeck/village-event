"use client";

import UiScale from "@/components/ui-scale";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { realtimeHub, defaultEventState } from "@/lib/realtime";
import { Participant, EventState, VoteAnswer } from "@/types";
import { defaultQuizzes, QuizQuestion } from "@/data/quiz";
import MobileLiveHeader from "@/components/mobile/MobileLiveHeader";
import ReactionPad from "@/components/mobile/ReactionPad";
import {
  HelpCircle,
  CheckCircle2,
  Send,
  MessageSquare,
  Sparkles,
  Award,
  ArrowRight,
  User,
} from "lucide-react";
import confetti from "canvas-confetti";

function LivePageContent() {
  const searchParams = useSearchParams();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [eventState, setEventState] = useState<EventState>(defaultEventState);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // 인라인 직접 입장용 상태 (참가자 정보가 없을 때 그 자리에서 바로 입력)
  const [fallbackNickname, setFallbackNickname] = useState<string>("");

  // 투표/퀴즈 관련 상태
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // 익명 질문 관련 상태
  const [questionText, setQuestionText] = useState<string>("");
  const [isQuestionSent, setIsQuestionSent] = useState<boolean>(false);

  // 초기 참가자 정보 감지
  useEffect(() => {
    // 1) URL 쿼리 파라미터에서 먼저 확인 (?nickname=...)
    const queryName = searchParams.get("nickname");
    if (queryName) {
      const reg = realtimeHub.registerParticipant(queryName);
      setParticipant(reg);
    } else {
      // 2) 로컬스토리지에서 확인
      const current = realtimeHub.getMyParticipant();
      if (current && current.nickname) {
        setParticipant(current);
      }
    }

    setEventState(realtimeHub.getEventState());

    // 네트워크 리스너
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOnline(navigator.onLine);

    // 실시간 상태 업데이트 구독
    const unsubState = realtimeHub.subscribe("state_changed", (newState: EventState) => {
      setEventState(newState);
      if (newState.activeQuizId !== eventState.activeQuizId) {
        setSelectedOption(null);
        setIsSubmitted(false);
      }
    });

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      unsubState();
    };
  }, [searchParams, eventState.activeQuizId]);

  // 활성 퀴즈/투표
  const activeQuiz: QuizQuestion | undefined = defaultQuizzes.find(
    (q) => q.id === eventState.activeQuizId
  );

  // 인라인 즉시 등록 핸들러 (튕기지 않고 화면 안에서 바로 등록!)
  const handleInlineRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = fallbackNickname.trim();
    if (!trimmed) return;

    const reg = realtimeHub.registerParticipant(trimmed);
    setParticipant(reg);
  };

  // 투표/퀴즈 답안 제출
  const handleVoteSubmit = (optionIdx: number) => {
    if (!participant || !activeQuiz || !eventState.isVoteOpen) return;

    setSelectedOption(optionIdx);
    setIsSubmitted(true);

    const vote: VoteAnswer = {
      participantId: participant.id,
      questionId: activeQuiz.id,
      optionIndex: optionIdx,
      timestamp: Date.now(),
    };

    realtimeHub.submitVote(vote);

    if (activeQuiz.type === "quiz" && activeQuiz.correctAnswer === optionIdx) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    }
  };

  // 익명 질문 전송
  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || !participant) return;

    realtimeHub.submitQuestion(questionText, participant.nickname, participant.id);
    setQuestionText("");
    setIsQuestionSent(true);

    setTimeout(() => {
      setIsQuestionSent(false), 3000;
    });
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ryeong_my_participant");
    }
    setParticipant(null);
  };

  // 참가자 등록이 안 되어 있는 경우 (절대 /join으로 튕겨서 에러를 내지 않고 그 자리에서 바로 입력받음!)
  if (!participant) {
    return (
      <div className="min-h-screen max-w-md mx-auto p-5 flex flex-col justify-center select-none">
        <UiScale mode="compact" />
        <div className="pop-card bg-white p-6 border-4 border-black text-center shadow-pop-lg">
          <div className="flex justify-center -mt-14 mb-3">
            <div className="w-20 h-20 rounded-full border-3 border-black bg-crayon-yellow flex items-center justify-center shadow-pop">
              <Image
                src="/characters/shinchan.png"
                alt="짱구"
                width={65}
                height={65}
                className="object-contain"
                priority
              />
            </div>
          </div>

          <h3 className="text-xl font-black text-neutral-900 mb-1">
            령고을 입장하기
          </h3>
          <p className="text-xs font-bold text-neutral-600 mb-4">
            입장 정보를 입력하면 실시간 참여가 시작됩니다!
          </p>

          <form onSubmit={handleInlineRegister} className="space-y-3">
            <div className="text-left">
              <label className="text-[11px] font-black text-neutral-700 block mb-1">
                입력 예시: <span className="text-crayon-red">예)000사랑방 00또래 000</span>
              </label>
              <input
                type="text"
                value={fallbackNickname}
                onChange={(e) => setFallbackNickname(e.target.value)}
                placeholder="예)000사랑방 00또래 000"
                maxLength={40}
                className="w-full px-3.5 py-3 rounded-xl border-3 border-black text-sm font-black focus:outline-none focus:ring-2 focus:ring-crayon-pink bg-neutral-50"
                autoFocus
              />
            </div>

            <div className="flex flex-wrap gap-1 justify-center py-1">
              {[
                "홍평안사랑방/97또래/000",
                "양혜선사랑방/98또래/000",
                "백승원사랑방/99또래/000",
              ].map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFallbackNickname(sample)}
                  className="px-2 py-0.5 rounded-lg border border-black/30 bg-amber-50 text-[10px] font-bold"
                >
                  {sample.split("/")[0]}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={!fallbackNickname.trim()}
              className="w-full py-3.5 rounded-xl border-3 border-black bg-crayon-yellow text-black font-black text-base shadow-pop hover:bg-yellow-300 active:translate-y-0.5 active:shadow-pop-sm flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <span>입장 완료하고 참여하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 참가자 등록 완료 후 메인 라이브 화면
  return (
    <div className="min-h-screen max-w-md mx-auto p-4 pb-12 flex flex-col gap-4 select-none">
      <UiScale mode="compact" />
      {/* 1) 상단 모바일 라이브 헤더 */}
      <MobileLiveHeader
        participant={participant}
        currentProgramId={eventState.currentProgramId}
        isOnline={isOnline}
        onLogout={handleLogout}
      />

      {/* 2) 실시간 반응 패드 */}
      <ReactionPad
        participant={participant}
        isEnabled={eventState.isReactionEnabled}
      />

      {/* 3) 실시간 투표 / 4지선다 퀴즈 영역 */}
      {eventState.isVoteOpen && activeQuiz ? (
        <div className="pop-card bg-white p-5 border-3 border-black">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`pop-tag text-white font-black text-xs ${
                activeQuiz.type === "quiz" ? "bg-crayon-red" : "bg-crayon-blue text-black"
              }`}
            >
              {activeQuiz.type === "quiz" ? "실시간 객관식 퀴즈" : "실시간 참여 투표"}
            </span>
            <span className="text-[10px] font-bold text-neutral-400">
              {isSubmitted ? "응답 완료!" : "선택지를 터치하세요"}
            </span>
          </div>

          <h3 className="text-base font-black text-neutral-900 mb-3">
            {activeQuiz.question}
          </h3>

          <div className="space-y-2">
            {activeQuiz.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = eventState.isQuizRevealed && activeQuiz.correctAnswer === idx;

              return (
                <button
                  key={idx}
                  onClick={() => handleVoteSubmit(idx)}
                  className={`w-full p-3.5 rounded-2xl border-2 border-black text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? "bg-crayon-yellow shadow-pop-sm font-black scale-[1.01]"
                      : "bg-neutral-50 hover:bg-neutral-100 font-bold"
                  } ${isCorrect ? "ring-2 ring-emerald-500 bg-emerald-50" : ""}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-black text-white text-xs font-mono flex items-center justify-center font-black">
                      {idx + 1}
                    </span>
                    <span className="text-sm">{option}</span>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                  )}
                  {isCorrect && (
                    <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {isSubmitted && (
            <p className="mt-3 text-center text-xs font-black text-crayon-pink">
              ✨ 제출되었습니다! 프로젝터 화면에서 실시간 결과를 확인해보세요.
            </p>
          )}

          {eventState.isQuizRevealed && activeQuiz.explanation && (
            <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900">
              💡 {activeQuiz.explanation}
            </div>
          )}
        </div>
      ) : (
        <div className="pop-card bg-neutral-100 p-4 border-2 border-dashed border-neutral-300 text-center">
          <p className="text-xs font-bold text-neutral-500">
            현재 진행 중인 투표/퀴즈가 없습니다. 다음 순서를 기다려주세요! 😊
          </p>
        </div>
      )}

      {/* 4) 익명 질문 & 나누고 싶은 이야기 전송 폼 */}
      <div className="pop-card bg-white p-5 border-3 border-black">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-4 h-4 text-crayon-blue" />
          <h4 className="text-sm font-black">익명 질문 & 나눔 보내기</h4>
        </div>
        <p className="text-xs font-bold text-neutral-500 mb-3">
          행사 중 나누고 싶은 이야기나 질문을 자유롭게 적어보세요! 관리자 확인 후 화면에 소개됩니다.
        </p>

        <form onSubmit={handleQuestionSubmit} className="space-y-3">
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="예: 오늘 점심 진짜 맛있었어요! / 사랑방 모임 기대돼요!"
            maxLength={120}
            rows={2}
            className="w-full p-3 rounded-xl border-2 border-black text-sm font-bold focus:outline-none focus:ring-2 focus:ring-crayon-pink bg-neutral-50"
          />

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-neutral-400">
              {questionText.length}/120자
            </span>

            <button
              type="submit"
              disabled={!questionText.trim()}
              className="pop-btn px-4 py-2 bg-crayon-pink text-white text-xs hover:bg-pink-500 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send className="w-3 h-3" />
              <span>전송하기</span>
            </button>
          </div>
        </form>

        {isQuestionSent && (
          <p className="mt-2 text-center text-xs font-black text-emerald-600 bg-emerald-50 py-1.5 rounded-lg border border-emerald-200">
            💌 질문이 성공적으로 전송되었습니다!
          </p>
        )}
      </div>

      {/* 하단 여백 안내 */}
      <div className="text-center text-[11px] font-bold text-neutral-400 mt-2">
        새로고침해도 내 닉네임과 참여 내역은 안전하게 유지됩니다.
      </div>
    </div>
  );
}

export default function LivePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold">령고을 로딩 중...</div>}>
      <LivePageContent />
    </Suspense>
  );
}
