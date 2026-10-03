"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Plus, Minus, ChevronUp, ChevronDown } from "lucide-react";
import { realtimeHub } from "@/lib/realtime";
import { TeamScore } from "@/types";

/**
 * 마지막 3페이지에서 조별 게임 점수를 확인하고 고치는 점수 편집 패널
 * - 처음에는 작은 버튼으로 접혀 있고, 누르면 5개 조의 점수판이 펼쳐진다
 * - 변경한 점수는 realtimeHub로 저장되어 다른 화면(진행자 콘솔 등)에도 바로 반영된다
 */
export default function ScoreEditor() {
  const [scores, setScores] = useState<TeamScore[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setScores(realtimeHub.getScores());
    const unsub = realtimeHub.subscribe("scores_updated", (next: TeamScore[]) => {
      setScores([...next]);
    });
    return () => {
      unsub();
    };
  }, []);

  // 점수 증감 (0점 아래로는 내려가지 않는다)
  const handleChange = (teamId: string, delta: number) => {
    const updated = realtimeHub.updateScore(teamId, delta);
    setScores([...updated]);
  };

  // 가장 높은 점수의 조에 왕관 표시 (0점이면 표시하지 않음)
  const topScore = Math.max(0, ...scores.map((s) => s.score));

  return (
    <div className="fixed right-3 top-3 z-50 flex w-72 flex-col items-end gap-2 sm:right-5 sm:top-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pop-btn flex items-center gap-1.5 bg-crayon-yellow px-4 py-2 text-sm text-black hover:bg-yellow-300"
        aria-expanded={isOpen}
      >
        <Trophy className="h-4 w-4" />
        <span>게임 점수 수정</span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {isOpen && (
        <div className="pop-card w-full border-3 border-black bg-white p-3">
          <ul className="space-y-2">
            {scores.map((team) => (
              <li
                key={team.id}
                className="flex items-center justify-between gap-2 rounded-xl border-2 border-black bg-neutral-50 px-2 py-1.5"
              >
                <div className="min-w-0">
                  <span className="block truncate text-xs font-black">
                    {topScore > 0 && team.score === topScore ? "👑 " : ""}
                    {team.name}
                  </span>
                  <span className="text-xl font-black text-crayon-red">{team.score}점</span>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => handleChange(team.id, -10)}
                    className="flex h-7 w-9 items-center justify-center rounded-lg border-2 border-black bg-white text-xs font-black hover:bg-red-100"
                    title="-10점"
                  >
                    <Minus className="h-3 w-3" />10
                  </button>
                  <button
                    onClick={() => handleChange(team.id, -1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-black bg-white text-xs font-black hover:bg-red-100"
                    title="-1점"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => handleChange(team.id, 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-black bg-white text-xs font-black hover:bg-yellow-100"
                    title="+1점"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => handleChange(team.id, 10)}
                    className="flex h-7 w-9 items-center justify-center rounded-lg border-2 border-black bg-crayon-yellow text-xs font-black hover:bg-yellow-300"
                    title="+10점"
                  >
                    <Plus className="h-3 w-3" />10
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
