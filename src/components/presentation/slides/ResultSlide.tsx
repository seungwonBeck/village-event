"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Trophy, RotateCcw } from "lucide-react";
import { realtimeHub } from "@/lib/realtime";
import { TeamScore } from "@/types";

type Phase = "input" | "drumroll" | "reveal";

// 두구두구 연출 시간 (ms)
const DRUMROLL_MS = 4500;

/**
 * 점수 발표 슬라이드 (마지막 페이지 바로 앞)
 * 1) 진행자가 조별 점수를 직접 입력 → 2) 두구두구 연출 → 3) 1등 조 발표
 */
export default function ResultSlide() {
  const [phase, setPhase] = useState<Phase>("input");
  const [teams, setTeams] = useState<TeamScore[]>([]);
  // 입력창은 문자열로 들고 있어야 지우고 다시 쓰는 동안 값이 튀지 않는다
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [ranked, setRanked] = useState<TeamScore[]>([]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confettiRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const drumRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = realtimeHub.getScores();
    setTeams(saved);
    setInputs(Object.fromEntries(saved.map((t) => [t.id, t.score > 0 ? String(t.score) : ""])));
    return () => {
      stopEffects();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // 폭죽과 북소리를 모두 멈춘다
  const stopEffects = () => {
    if (confettiRef.current) clearInterval(confettiRef.current);
    if (drumRef.current) clearTimeout(drumRef.current);
    if (audioRef.current) {
      audioRef.current.close().catch(() => undefined);
      audioRef.current = null;
    }
  };

  // 북소리: 짧은 노이즈를 점점 빠르게 쳐서 드럼롤을 만들고, 마지막에 크게 한 번 친다
  const playDrumRoll = () => {
    try {
      const ctx = new AudioContext();
      audioRef.current = ctx;
      const hit = (volume: number, length: number) => {
        const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * length), ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
        }
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 900;
        const gain = ctx.createGain();
        gain.gain.value = volume;
        src.connect(filter).connect(gain).connect(ctx.destination);
        src.start();
      };
      const started = Date.now();
      const roll = () => {
        const progress = Math.min(1, (Date.now() - started) / DRUMROLL_MS);
        if (progress >= 1) {
          hit(1, 0.6);
          return;
        }
        hit(0.25 + progress * 0.5, 0.08);
        // 시간이 지날수록 간격이 짧아진다 (180ms -> 45ms)
        drumRef.current = setTimeout(roll, 180 - progress * 135);
      };
      roll();
    } catch {
      // 소리를 낼 수 없는 환경이면 화면 연출만 보여준다
    }
  };

  const parsedScore = (id: string) => {
    const n = parseInt(inputs[id] ?? "0", 10);
    return Number.isNaN(n) ? 0 : Math.max(0, n);
  };

  const maxInput = Math.max(0, ...teams.map((t) => parsedScore(t.id)));

  // 결과 발표 시작: 입력한 점수를 저장하고 두구두구 → 1등 공개
  const handleStart = () => {
    const finalTeams = teams.map((t) => ({ ...t, score: parsedScore(t.id) }));
    finalTeams.forEach((t) => {
      const before = teams.find((x) => x.id === t.id)?.score ?? 0;
      if (t.score !== before) realtimeHub.updateScore(t.id, t.score - before);
    });
    setTeams(finalTeams);
    setRanked([...finalTeams].sort((a, b) => b.score - a.score));
    setPhase("drumroll");
    playDrumRoll();

    timerRef.current = setTimeout(() => {
      setPhase("reveal");
      // 1등이 나오는 순간부터 3초 동안 폭죽을 계속 터뜨린다
      const end = Date.now() + 3000;
      confettiRef.current = setInterval(() => {
        confetti({ particleCount: 60, spread: 80, origin: { x: Math.random(), y: 0.4 } });
        if (Date.now() > end && confettiRef.current) clearInterval(confettiRef.current);
      }, 250);
    }, DRUMROLL_MS);
  };

  const handleReset = () => {
    stopEffects();
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("input");
  };

  // 공동 1등까지 모두 찾는다
  const topScore = ranked[0]?.score ?? 0;
  const winners = ranked.filter((t) => t.score === topScore);

  return (
    <div className="relative z-10 flex h-full w-full select-none flex-col items-center justify-center p-3 text-center sm:p-6 md:p-8">
      {phase === "input" && (
        <div className="pop-card relative w-full max-w-3xl border-3 border-black bg-white/95 p-5 shadow-pop-xl sm:border-5 sm:p-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-black bg-crayon-yellow px-5 py-1.5 text-base font-black shadow-pop-sm sm:border-4 sm:text-xl">
            <Trophy className="h-5 w-5" /> 오늘의 게임 점수 입력
          </div>
          <ul className="space-y-3">
            {teams.map((team) => (
              <li
                key={team.id}
                className="flex items-center justify-between gap-3 rounded-2xl border-3 border-black bg-neutral-50 px-4 py-2"
              >
                <span className="flex items-center gap-2 text-lg font-black sm:text-2xl">
                  <span className={`inline-block h-5 w-5 rounded-full border-2 border-black ${team.color}`} />
                  {team.name}
                </span>
                <span className="flex items-center gap-2">
                  {/* 모두가 같이 보는 화면이라 점수는 비밀번호처럼 별표(*)로만 보이게 한다 */}
                  <input
                    type="password"
                    inputMode="numeric"
                    autoComplete="new-password"
                    maxLength={4}
                    placeholder="****"
                    value={inputs[team.id] ?? ""}
                    onChange={(e) =>
                      setInputs((prev) => ({ ...prev, [team.id]: e.target.value.replace(/\D/g, "") }))
                    }
                    className="w-28 rounded-xl border-3 border-black bg-white px-3 py-1.5 text-right text-2xl font-black tracking-widest text-crayon-red outline-none placeholder:text-neutral-300 focus:bg-crayon-yellow/40 sm:w-36 sm:text-3xl"
                    aria-label={`${team.name} 점수`}
                  />
                  <span className="text-lg font-black sm:text-2xl">점</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleStart}
              disabled={maxInput <= 0}
              className="pop-btn bg-crayon-pink px-8 py-3 text-xl text-white hover:bg-pink-500 disabled:cursor-not-allowed disabled:opacity-40 sm:text-3xl"
            >
              🥁 결과 발표!
            </button>
          </div>
          {maxInput <= 0 && (
            <p className="mt-2 text-sm font-bold text-neutral-500">점수를 입력하면 발표 버튼이 켜져요</p>
          )}
        </div>
      )}

      {phase === "drumroll" && (
        <div className="flex flex-col items-center gap-6">
          <div className="animate-bounce text-8xl sm:text-9xl">🥁</div>
          <h1 className="animate-pulse text-5xl font-black tracking-tight text-neutral-900 drop-shadow-[2px_2px_0px_#fff] sm:text-8xl">
            두구두구두구두구...
          </h1>
          <p className="text-xl font-black text-neutral-700 sm:text-3xl">과연 오늘의 1등 조는?!</p>
        </div>
      )}

      {phase === "reveal" && (
        <div className="pop-card relative w-full max-w-4xl border-3 border-black bg-white/95 p-5 shadow-pop-xl sm:border-5 sm:p-8">
          <div className="mb-3 inline-block rounded-full border-2 border-black bg-crayon-yellow px-6 py-1.5 text-lg font-black shadow-pop-sm sm:border-4 sm:text-2xl">
            🏆 {winners.length > 1 ? "공동 1등" : "1등"} 🏆
          </div>
          <div className="space-y-2">
            {winners.map((team) => (
              <h1
                key={team.id}
                className={`inline-block rounded-3xl border-4 border-black px-8 py-3 text-5xl font-black tracking-tight text-neutral-900 shadow-pop-lg sm:text-8xl ${team.color}`}
              >
                {team.name}
              </h1>
            ))}
          </div>
          <p className="mt-3 text-3xl font-black text-crayon-red sm:text-5xl">{topScore}점</p>

          <ul className="mx-auto mt-5 grid max-w-2xl grid-cols-1 gap-1.5 text-left sm:grid-cols-2">
            {ranked.map((team, idx) => (
              <li
                key={team.id}
                className="flex items-center justify-between rounded-xl border-2 border-black bg-neutral-50 px-3 py-1 text-base font-black sm:text-xl"
              >
                <span>
                  {/* 동점이면 같은 등수로 표시 */}
                  {ranked.findIndex((t) => t.score === team.score) + 1 || idx + 1}등 · {team.name}
                </span>
                <span className="text-crayon-red">{team.score}점</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex justify-center">
            <button
              onClick={handleReset}
              className="pop-btn bg-white px-5 py-2 text-sm text-black hover:bg-neutral-100 sm:text-lg"
            >
              <RotateCcw className="h-4 w-4" /> 점수 다시 입력
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
