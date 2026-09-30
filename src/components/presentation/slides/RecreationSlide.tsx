"use client";

import React, { useState, useEffect, useRef } from "react";
import { event } from "@/data/event";
import { recreationGames, RecreationGame } from "@/data/recreation";
import { realtimeHub } from "@/lib/realtime";
import { TeamScore, Participant } from "@/types";
import confetti from "canvas-confetti";
import {
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Users,
  HelpCircle,
  Clock,
  Shuffle,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react";

/**
 * 04 RECREATION SLIDE
 * 레크리에이션 게임 안내, 대형 타이머, 팀 점수판, 랜덤 문제/참가자 추첨
 */
export default function RecreationSlide() {
  const [selectedGameIndex, setSelectedGameIndex] = useState<number>(0);
  const currentGame: RecreationGame = recreationGames[selectedGameIndex] || recreationGames[0];

  // 타이머 상태 관리
  const [timeLeft, setTimeLeft] = useState<number>(currentGame.durationSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 팀 점수판 상태 관리
  const [scores, setScores] = useState<TeamScore[]>([]);

  // 랜덤 문제 추첨 상태
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [isRollingQuestion, setIsRollingQuestion] = useState<boolean>(false);

  // 참가자 추첨 상태
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [drawnWinner, setDrawnWinner] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // 초기 점수 및 참가자 동기화
  useEffect(() => {
    setScores(realtimeHub.getScores());
    setParticipants(realtimeHub.getParticipants());

    const unsubScores = realtimeHub.subscribe("scores_updated", (newScores: TeamScore[]) => {
      setScores(newScores);
    });

    const unsubParticipants = realtimeHub.subscribe("participant_joined", (p: Participant) => {
      setParticipants((prev) => [...prev.filter((item) => item.id !== p.id), p]);
    });

    return () => {
      unsubScores();
      unsubParticipants();
    };
  }, []);

  // 게임 변경 시 타이머 리셋
  useEffect(() => {
    setTimeLeft(currentGame.durationSeconds);
    setIsTimerRunning(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setCurrentQuestion(null);
  }, [currentGame]);

  // 타이머 인터벌
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setIsTimerRunning(false);
            // 종료 축하 콘페티
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning]);

  // 시간 포맷팅 (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // 점수 증감 핸들러
  const handleScoreChange = (teamId: string, delta: number) => {
    const updated = realtimeHub.updateScore(teamId, delta);
    setScores([...updated]);
    if (delta > 0) {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    }
  };

  // 랜덤 문제 뽑기 함수
  const handleDrawQuestion = () => {
    const qList = currentGame.questions || [];
    if (qList.length === 0) {
      setCurrentQuestion("준비된 문제가 없습니다.");
      return;
    }

    setIsRollingQuestion(true);
    let count = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * qList.length);
      setCurrentQuestion(qList[randomIdx]);
      count++;
      if (count > 10) {
        clearInterval(interval);
        setIsRollingQuestion(false);
      }
    }, 80);
  };

  // 랜덤 참가자 추첨 함수 (룰렛 효과)
  const handleDrawParticipant = () => {
    const list =
      participants.length > 0
        ? participants.map((p) => p.nickname)
        : ["홍평안", "김은혜", "이지혜", "박요셉", "김다윗", "최소망", "정온유", "윤기쁨"];

    setIsDrawing(true);
    setDrawnWinner(null);

    let step = 0;
    const totalSteps = 20;
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * list.length);
      setDrawnWinner(list[idx]);
      step++;
      if (step >= totalSteps) {
        clearInterval(interval);
        setIsDrawing(false);
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
        });
      }
    }, 100);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between py-4 px-3 sm:py-5 sm:px-8 md:px-10 z-10 gap-4 sm:gap-6">
      {/* 상단 탭: 게임 1, 2, 3, 4 선택 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="plate flex shrink-0 flex-col items-center whitespace-nowrap px-6 py-3 text-center">
          <div className="pop-tag bg-crayon-pink text-white text-xs mb-1">{event.eventLabel}</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">
            못말리는 <span className="text-crayon-blue">게임 배틀</span>
          </h2>
        </div>

        {/* 게임 네비게이션 탭 */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {recreationGames.map((game, idx) => (
            <button
              key={game.id}
              onClick={() => setSelectedGameIndex(idx)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 border-2 sm:border-3 border-black rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm transition-all ${
                selectedGameIndex === idx
                  ? "bg-crayon-yellow shadow-pop scale-105"
                  : "bg-white shadow-pop-sm hover:bg-neutral-100"
              }`}
            >
              GAME 0{game.id}
            </button>
          ))}
        </div>
      </div>

      {/* 중앙 메인: 게임 설명은 한 줄 전체, 아래에 점수 40% · 타이머 30% · 제시어 20% · 랜덤추천 10% */}
      <div className="my-auto flex w-full flex-col gap-4">
        <div className="pop-card bg-white p-6 border-4 border-black relative">
            <div className="flex items-center justify-between mb-2">
              <span className="pop-tag bg-crayon-yellow text-black font-extrabold text-sm">
                GAME 0{currentGame.id}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-neutral-600">
                <Clock className="w-4 h-4 text-crayon-red" />
                제한시간 {currentGame.duration}
              </span>
            </div>

            <h3 className="text-3xl font-black text-crayon-text mb-2">
              {currentGame.title}
            </h3>
            <p className="text-base font-bold text-neutral-700 mb-4">
              {currentGame.description}
            </p>

            {/* 규칙 목록 카드 */}
            <div className="bg-amber-50/70 border-2 border-dashed border-black/30 rounded-2xl p-4">
              <h4 className="text-sm font-black text-crayon-red mb-2 uppercase tracking-wider">
                📌 게임 진행 규칙
              </h4>
              <ul className="space-y-1.5 text-sm font-bold text-neutral-800">
                {currentGame.rules.map((rule, rIdx) => (
                  <li key={rIdx} className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-crayon-pink shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 꿀팁 배너 */}
            {currentGame.tips && (
              <p className="mt-3 text-xs font-black text-neutral-500">
                💡 TIP: {currentGame.tips}
              </p>
            )}
          </div>


        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
          <div className="min-w-0 lg:basis-[40%]">
          {/* 실시간 팀 점수판 */}
          <div className="pop-card bg-white p-4 border-3 border-black h-full">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h4 className="font-black text-sm">실시간 팀 점수판</h4>
              </div>
              <span className="text-xs font-bold text-neutral-500">클릭하여 점수 증감</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {scores.map((team) => (
                <div
                  key={team.id}
                  className="border-2 border-black rounded-xl p-2 flex items-center justify-between bg-neutral-50"
                >
                  <div>
                    <span className="text-xs font-black block">{team.name}</span>
                    <span className="text-xl font-black text-crayon-red">{team.score}점</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleScoreChange(team.id, -10)}
                      className="w-6 h-6 border-2 border-black rounded-lg bg-white hover:bg-red-100 flex items-center justify-center font-bold text-xs"
                      title="-10점"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleScoreChange(team.id, 10)}
                      className="w-6 h-6 border-2 border-black rounded-lg bg-crayon-yellow hover:bg-yellow-300 flex items-center justify-center font-bold text-xs"
                      title="+10점"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          </div>
          <div className="min-w-0 lg:basis-[30%]">
          {/* 대형 타이머 카드 */}
          <div className="pop-card bg-crayon-yellow p-5 border-4 border-black text-center h-full">
            <span className="text-xs font-black text-neutral-700 tracking-wider uppercase block mb-1">
              GAME TIMER
            </span>
            <div className="text-6xl font-black font-mono tracking-tight text-black my-1">
              {formatTime(timeLeft)}
            </div>

            {/* 타이머 제어 버튼 그룹 */}
            <div className="flex items-center justify-center gap-3 mt-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`pop-btn px-5 py-2 text-sm ${
                  isTimerRunning
                    ? "bg-crayon-red text-white hover:bg-red-600"
                    : "bg-crayon-green text-black hover:bg-emerald-400"
                }`}
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-4 h-4" /> 일시정지
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Start 시작
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimeLeft(currentGame.durationSeconds);
                }}
                className="pop-btn px-4 py-2 bg-white text-black text-sm hover:bg-neutral-100"
              >
                <RotateCcw className="w-4 h-4" /> 리셋
              </button>
            </div>
          </div>

          </div>
          <div className="min-w-0 lg:basis-[20%]">
          {/* 랜덤 문제 카드 */}
          <div className="pop-card bg-crayon-yellow/40 p-4 border-3 border-black flex flex-col justify-between gap-3 h-full">
            <div className="flex flex-col items-start gap-2">
              <div className="w-10 h-10 rounded-xl bg-crayon-blue border-2 border-black flex items-center justify-center font-black text-white shadow-pop-sm">
                <HelpCircle className="w-5 h-5 text-black" />
              </div>
              <div>
                <span className="text-xs font-black text-neutral-600 block">게임 제시어 / 문제</span>
                <span className="text-lg font-black text-neutral-900">
                  {currentQuestion || "오른쪽 버튼을 눌러 문제를 뽑아주세요!"}
                </span>
              </div>
            </div>

            <button
              onClick={handleDrawQuestion}
              disabled={isRollingQuestion}
              className="pop-btn px-4 py-2 bg-crayon-pink text-white text-sm hover:bg-pink-500 shrink-0"
            >
              <Shuffle className="w-4 h-4" />
              <span>{isRollingQuestion ? "뽑는 중..." : "문제 뽑기"}</span>
            </button>
          </div>
          </div>
          <div className="min-w-0 lg:basis-[10%]">
          {/* 랜덤 참가자 추첨 룰렛 */}
          <div className="pop-card bg-white p-3.5 border-3 border-black flex flex-col items-center justify-between gap-2 text-center h-full">
            <div className="flex flex-col items-center gap-2 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-crayon-pink border-2 border-black flex items-center justify-center text-white shrink-0 shadow-pop-sm">
                <Users className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-black text-neutral-500 block">참가자 랜덤 추첨</span>
                <span className="text-base font-black truncate block text-crayon-pink">
                  {drawnWinner ? `🎉 ${drawnWinner} 님!` : "버튼을 눌러 뽑아보세요"}
                </span>
              </div>
            </div>

            <button
              onClick={handleDrawParticipant}
              disabled={isDrawing}
              className="pop-btn px-3.5 py-1.5 bg-crayon-blue text-black text-xs hover:bg-sky-300 shrink-0"
            >
              {isDrawing ? "추첨 중..." : "추첨하기"}
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
