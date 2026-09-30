"use client";

import React, { useEffect, useState } from "react";
import { realtimeHub } from "@/lib/realtime";
import { defaultQuizzes, QuizQuestion } from "@/data/quiz";
import { EventState, VoteAnswer, AnonymousQuestion } from "@/types";
import { BarChart3, CheckCircle2, MessageSquare, X } from "lucide-react";
import confetti from "canvas-confetti";

interface LiveInteractionOverlayProps {
  eventState: EventState;
}

/**
 * 프로젝터용 실시간 투표/퀴즈 결과 표시 및 승인된 질문 팝업 오버레이
 */
export default function LiveInteractionOverlay({ eventState }: LiveInteractionOverlayProps) {
  const [votes, setVotes] = useState<VoteAnswer[]>([]);
  const [approvedQuestion, setApprovedQuestion] = useState<AnonymousQuestion | null>(null);

  const activeQuiz: QuizQuestion | undefined = defaultQuizzes.find(
    (q) => q.id === eventState.activeQuizId
  );

  useEffect(() => {
    setVotes(realtimeHub.getVotes());

    const unsubVote = realtimeHub.subscribe("vote_submitted", (vote: VoteAnswer) => {
      setVotes((prev) => [
        ...prev.filter(
          (v) => !(v.participantId === vote.participantId && v.questionId === vote.questionId)
        ),
        vote,
      ]);
    });

    const unsubQuestion = realtimeHub.subscribe(
      "question_updated",
      (q: AnonymousQuestion) => {
        if (q.approved) {
          setApprovedQuestion(q);
        }
      }
    );

    return () => {
      unsubVote();
      unsubQuestion();
    };
  }, []);

  // 정답 공개 시 콘페티 효과
  useEffect(() => {
    if (eventState.isQuizRevealed && activeQuiz?.type === "quiz") {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    }
  }, [eventState.isQuizRevealed, activeQuiz]);

  // 투표 통계 계산
  const currentVotes = activeQuiz
    ? votes.filter((v) => v.questionId === activeQuiz.id)
    : [];
  const totalVotesCount = currentVotes.length;

  const optionCounts = (activeQuiz?.options || []).map((_, idx) => {
    return currentVotes.filter((v) => v.optionIndex === idx).length;
  });

  return (
    <>
      {/* 1) 실시간 투표/퀴즈 모달 (관리자가 투표를 오픈했을 때 노출) */}
      {eventState.isVoteOpen && activeQuiz && (
        <div className="absolute inset-x-3 top-14 z-40 max-h-[75vh] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200 sm:inset-x-auto sm:right-10 sm:w-full sm:max-w-md">
          <div className="pop-card bg-white p-5 border-4 border-black shadow-pop-lg">
            <div className="flex items-center justify-between mb-2">
              <span
                className={`pop-tag text-white font-black text-xs ${
                  activeQuiz.type === "quiz" ? "bg-crayon-red" : "bg-crayon-blue text-black"
                }`}
              >
                {activeQuiz.type === "quiz" ? "실시간 퀴즈" : "실시간 투표"}
              </span>
              <span className="text-xs font-mono font-bold text-neutral-500">
                참여 {totalVotesCount}명
              </span>
            </div>

            <h4 className="text-base font-black text-neutral-900 mb-3">
              {activeQuiz.question}
            </h4>

            {/* 선택지별 득표 바 */}
            <div className="space-y-2">
              {activeQuiz.options.map((option, idx) => {
                const count = optionCounts[idx];
                const percent = totalVotesCount > 0 ? Math.round((count / totalVotesCount) * 100) : 0;
                const isCorrect = eventState.isQuizRevealed && activeQuiz.correctAnswer === idx;

                return (
                  <div
                    key={idx}
                    className={`border-2 border-black rounded-xl p-2.5 transition-all ${
                      isCorrect ? "bg-emerald-100 border-emerald-600 ring-2 ring-emerald-500" : "bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-black mb-1">
                      <span className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-mono">
                          {idx + 1}
                        </span>
                        <span>{option}</span>
                        {isCorrect && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                        )}
                      </span>
                      <span className="font-mono text-neutral-600">
                        {count}표 ({percent}%)
                      </span>
                    </div>

                    {/* 진행 막대바 */}
                    <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden border border-black/20">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isCorrect ? "bg-emerald-500" : "bg-crayon-yellow"
                        } ${getBarWidthClass(percent)}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 정답 해설 (공개 시) */}
            {eventState.isQuizRevealed && activeQuiz.explanation && (
              <p className="mt-3 text-xs font-bold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-300">
                🎉 {activeQuiz.explanation}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 2) 승인된 익명 질문 팝업 배너 */}
      {approvedQuestion && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 max-w-lg w-full">
          <div className="pop-card bg-crayon-yellow p-4 border-4 border-black flex items-start gap-3 shadow-pop-lg animate-in slide-in-from-top-6">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4 text-crayon-yellow" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-neutral-700">
                  {approvedQuestion.senderName} 님의 나눔
                </span>
                <button
                  onClick={() => setApprovedQuestion(null)}
                  className="p-1 hover:bg-black/10 rounded-lg text-neutral-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-sm font-extrabold text-neutral-900 mt-1">
                &ldquo;{approvedQuestion.content}&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Tailwind 폭 클래스로 매핑
function getBarWidthClass(percent: number): string {
  if (percent <= 0) return "w-0";
  if (percent <= 10) return "w-[10%]";
  if (percent <= 20) return "w-[20%]";
  if (percent <= 30) return "w-[30%]";
  if (percent <= 40) return "w-[40%]";
  if (percent <= 50) return "w-[50%]";
  if (percent <= 60) return "w-[60%]";
  if (percent <= 70) return "w-[70%]";
  if (percent <= 80) return "w-[80%]";
  if (percent <= 90) return "w-[90%]";
  return "w-full";
}
