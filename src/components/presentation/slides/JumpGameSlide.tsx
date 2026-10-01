"use client";

import React, { useEffect, useRef, useState } from "react";
import { groups } from "@/data/groups";
import { characterPngs } from "@/components/event-art";

const W = 960;
const H = 420;
const GROUND = 350; // 땅 높이(y)
const SIZE = 96; // 캐릭터 크기
const BLOCK_W = 40; // 블록 한 칸 너비
const GAME_SECONDS = 20; // 20초를 버티면 클리어
const SPEED_START = 7.5; // 처음엔 상대적으로 천천히
const SPEED_END = 26; // 20초 즈음엔 아주 빠르게
const JUMP_POWER = -18.5; // 한 번 점프로 모든 블록(최대 높이 100, 최대 3칸)을 넘을 수 있는 높이
const GRAVITY = 1.1;
const COLORS = ["#F2545B", "#4BB3FD", "#FFD23F", "#5CC96B"];

interface Obstacle {
  x: number;
  count: number; // 블록 칸 수 (1~3칸이 붙어서 나옴)
  h: number; // 블록 높이 (낮은 것부터 높은 것까지 다양하게)
  color: string;
}

// 블록 배치 패턴: 매번 다른 모양으로 나와서 리듬을 외울 수 없게 한다 (dx = 패턴 시작점 기준 위치)
// 점프 한 번의 체공 시간(약 34프레임) 동안 이동하는 거리 = speed * 34. 이보다 가까운 두 블록은 한 번에 같이 넘어야 하므로,
// 패턴 안의 블록 간격은 "한 번 점프로 둘 다 넘는 거리"로만 만들고, 다른 패턴 사이는 착지 후 다시 뛸 수 있는 거리를 보장한다.
const rand = (a: number, b: number) => a + Math.random() * (b - a);
// 넓은 블록일수록 낮게: 체공 시간 안에 지나갈 수 있는 높이만 허용 (1칸 100, 2칸 80, 3칸 60)
const maxHeight = (count: number) => [100, 80, 60][count - 1] ?? 60;
const JUMP_FRAMES = 38; // 체공 34프레임 + 반응 여유
function makePattern(speed: number): { dx: number; count: number; h: number }[] {
  const r = Math.random();
  const count = () => 1 + Math.floor(Math.random() * 3);
  // 낮은 블록(h<=65) 위를 지나는 시간 동안 이동하는 거리 (캐릭터 폭·여유 제외)
  const clearSpan = speed * 20 - 50;
  if (r < 0.3) {
    const c = count();
    return [{ dx: 0, count: c, h: rand(40, maxHeight(c)) }]; // 하나
  }
  if (r < 0.5) {
    // 계단: 점점 높아지거나 낮아지는 붙은 블록
    const hs = Math.random() < 0.5 ? [45, 70, 100] : [100, 70, 45];
    return hs.map((h, i) => ({ dx: i * BLOCK_W, count: 1, h }));
  }
  if (r < 0.7 && clearSpan >= 2 * BLOCK_W + 30) {
    // 쌍둥이: 한 번 점프로 둘 다 넘을 수 있는 간격 (속도가 느리면 이 패턴은 건너뜀)
    const gap = Math.min(rand(40, 130), clearSpan - 2 * BLOCK_W - 20);
    return [
      { dx: 0, count: 1, h: rand(40, 65) },
      { dx: BLOCK_W + gap, count: 1, h: rand(40, 65) },
    ];
  }
  if (r < 0.85 && clearSpan >= 3 * BLOCK_W + 50) {
    // 연타: 작은 블록 세 개가 연속 (빠를 때만, 한 번 점프로 전부 넘는 간격)
    const gap = Math.min(rand(40, 90), (clearSpan - 3 * BLOCK_W - 20) / 2);
    return [0, 1, 2].map((i) => ({ dx: i * (BLOCK_W + gap), count: 1, h: rand(40, 65) }));
  }
  // 벽: 높고 넓은 블록
  const c = 2 + Math.floor(Math.random() * 2);
  return [{ dx: 0, count: c, h: rand(maxHeight(c) - 15, maxHeight(c)) }];
}

type Phase = "ready" | "play" | "over" | "clear";

/**
 * 짱구 점프 게임 (20초 버티기)
 * - 스페이스/↑/클릭: 점프, 누르고 있으면 더 높이 점프
 * - 속도는 시간에 따라 천천히 빨라지고, 장애물은 블록 1~3칸 묶음
 * - 매 프레임 바뀌는 값은 지역 변수로 두고 canvas에 직접 그려 리렌더를 피한다
 */
export default function JumpGameSlide() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const jumpRef = useRef<() => void>(() => {});
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  // 사랑방 리더별 캐릭터 선택 (기본: 첫 번째 리더)
  const [leaderId, setLeaderId] = useState(groups[0].id);
  const [phase, setPhase] = useState<Phase>("ready");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let y = GROUND - SIZE;
    let vy = 0;
    let obstacles: Obstacle[] = [];
    let points = 0;
    let elapsed = 0; // 진행 시간(초)
    let lastTime = performance.now();
    let nextSpawnX = 0; // 마지막 장애물 이후 다음 생성까지 남은 이동 거리
    let shownLeft = GAME_SECONDS;
    let state: Phase = "ready";
    let raf = 0;

    const reset = () => {
      y = GROUND - SIZE;
      vy = 0;
      obstacles = [];
      points = 0;
      elapsed = 0;
      nextSpawnX = 500;
      shownLeft = GAME_SECONDS;
      setScore(0);
      setTimeLeft(GAME_SECONDS);
    };

    const jump = () => {
      if (state !== "play") {
        reset();
        state = "play";
        setPhase("play");
        return;
      }
      if (y >= GROUND - SIZE) vy = JUMP_POWER;
    };
    jumpRef.current = jump;

    const finish = (next: Phase) => {
      state = next;
      setPhase(next);
    };

    const loop = (now: number) => {
      // 프레임 간격을 60fps 기준 배율로 보정 (고주사율 모니터에서도 같은 속도)
      const dt = Math.min(3, (now - lastTime) / 16.667);
      lastTime = now;

      if (state === "play") {
        elapsed += (dt * 16.667) / 1000;
        // 제곱 곡선: 갈수록 가속이 커져서 막판이 훨씬 빨라진다
        const speed = SPEED_START + (SPEED_END - SPEED_START) * Math.min(1, elapsed / GAME_SECONDS) ** 1.7;

        vy += GRAVITY * dt;
        y = Math.min(GROUND - SIZE, y + vy * dt);
        if (y === GROUND - SIZE) vy = 0;

        // 블록 생성 (마지막 3초는 새로 안 나옴 → 깔끔하게 클리어)
        nextSpawnX -= speed * dt;
        if (nextSpawnX <= 0 && elapsed < GAME_SECONDS - 3) {
          const pattern = makePattern(speed);
          pattern.forEach((b) =>
            obstacles.push({ x: W + 20 + b.dx, count: b.count, h: b.h, color: COLORS[Math.floor(Math.random() * COLORS.length)] })
          );
          const width = pattern[pattern.length - 1].dx + pattern[pattern.length - 1].count * BLOCK_W;
          // 다음 패턴까지 간격: 착지 후 다시 뛸 수 있는 거리를 보장하고, 여유분만 들쭉날쭉하게
          nextSpawnX = width + speed * JUMP_FRAMES + rand(0, 120);
        }
        obstacles.forEach((o) => (o.x -= speed * dt));
        const passed = obstacles.filter((o) => o.x + o.count * BLOCK_W < 0).length;
        if (passed) {
          obstacles = obstacles.filter((o) => o.x + o.count * BLOCK_W >= 0);
          points += passed;
          setScore(points);
        }

        // 충돌 판정 (캐릭터 몸통과 장난감 모두 살짝 작게)
        const hit = obstacles.some(
          (o) => 120 + SIZE - 26 > o.x + 8 && 120 + 26 < o.x + o.count * BLOCK_W - 8 && y + SIZE - 12 > GROUND - o.h
        );
        const left = Math.max(0, Math.ceil(GAME_SECONDS - elapsed));
        if (left !== shownLeft) {
          shownLeft = left;
          setTimeLeft(left);
        }
        if (hit) finish("over");
        else if (elapsed >= GAME_SECONDS) finish("clear");
      }

      // 그리기
      ctx.fillStyle = "#BDE8FF";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#FFFFFF";
      [[160, 70], [520, 50], [800, 90]].forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 28, 0, Math.PI * 2);
        ctx.arc(cx + 30, cy + 6, 22, 0, Math.PI * 2);
        ctx.arc(cx - 28, cy + 8, 20, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.fillStyle = "#8BD36B";
      ctx.fillRect(0, GROUND, W, H - GROUND);
      ctx.fillStyle = "#3A2A1E";
      ctx.fillRect(0, GROUND, W, 5);

      // 진행 막대 (20초 중 얼마나 왔는지)
      ctx.fillStyle = "rgba(58,42,30,0.25)";
      ctx.fillRect(20, 16, W - 40, 10);
      ctx.fillStyle = "#F2545B";
      ctx.fillRect(20, 16, (W - 40) * Math.min(1, elapsed / GAME_SECONDS), 10);

      obstacles.forEach((o) => {
        ctx.fillStyle = o.color;
        ctx.strokeStyle = "#3A2A1E";
        ctx.lineWidth = 4;
        ctx.fillRect(o.x, GROUND - o.h, o.count * BLOCK_W, o.h);
        ctx.strokeRect(o.x, GROUND - o.h, o.count * BLOCK_W, o.h);
      });

      const img = imgRef.current;
      if (img?.complete && img.naturalWidth) {
        ctx.drawImage(img, 120, y, SIZE * (img.naturalWidth / img.naturalHeight), SIZE);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // 캡처 단계에서 받아 슬라이드 단축키(스페이스=다음 슬라이드)보다 앞서 처리. ←/→는 그대로 슬라이드 이동
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        e.stopImmediatePropagation();
        // 키를 계속 누를 때 반복 입력으로 다시 점프하지 않게
        if (!e.repeat) jump();
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, []);

  // 선택한 리더의 캐릭터 이미지를 불러온다 (게임 진행은 끊기지 않음)
  useEffect(() => {
    const leader = groups.find((g) => g.id === leaderId) ?? groups[0];
    const img = new Image();
    img.src = characterPngs[leader.character];
    imgRef.current = img;
  }, [leaderId]);

  const message =
    phase === "ready"
      ? "스페이스 / 화면 클릭으로 시작! 20초만 버텨요"
      : phase === "clear"
        ? `🎉 클리어! 블록 ${score}개 넘었어요 · 다시 하려면 클릭`
        : `게임 오버 · ${score}개 넘음 · 다시 하려면 클릭`;

  return (
    <div className="flex h-full w-full select-none flex-col items-center justify-center gap-3 px-3 pb-20 pt-3 text-center sm:gap-4 sm:px-10 xl:pb-3">
      <div className="plate flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-2 sm:px-8 sm:py-3">
        <h2 className="text-xl sm:text-3xl">짱구 점프 게임</h2>
        <p className="text-sm sm:text-xl">
          남은 시간 <b>{timeLeft}</b>초 · 넘은 블록 <b>{score}</b>
        </p>
      </div>

      <div className="relative w-full max-w-4xl">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          onPointerDown={() => jumpRef.current()}
          className="w-full cursor-pointer touch-none rounded-2xl border-4 border-black bg-white shadow-pop"
        />
        {phase !== "play" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="plate px-6 py-3 text-lg sm:text-3xl">{message}</p>
          </div>
        )}
      </div>

      <div className="flex max-w-4xl flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {groups.map((g) => (
          <button
            key={g.id}
            onClick={() => setLeaderId(g.id)}
            className={`flex items-center gap-1.5 rounded-full border-2 border-black px-2 py-1 text-xs sm:text-base ${
              leaderId === g.id ? "bg-shin-yellow shadow-pop-sm" : "bg-white/90"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={characterPngs[g.character]} alt="" className="h-6 w-6 object-contain sm:h-8 sm:w-8" />
            {g.leaderName}
          </button>
        ))}
      </div>

      <p className="text-xs sm:text-base">스페이스 · ↑ · 클릭 = 점프 · ← → 로 슬라이드 이동</p>
    </div>
  );
}
