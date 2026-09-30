import { Participant, ReactionEvent, AnonymousQuestion, VoteAnswer, TeamScore, EventState } from "@/types";
import { supabase, isSupabaseConfigured } from "./supabase";

/**
 * 하이브리드 실시간 이벤트 허브
 * 1) Supabase Realtime 채널 (온라인 연동 시)
 * 2) BroadcastChannel & Storage Event (동일 브라우저/오프라인 환경에서도 100% 실시간 동기화)
 */

const CHANNEL_NAME = "ryeong_goul_event_channel";
const STORAGE_KEYS = {
  PARTICIPANTS: "ryeong_participants",
  EVENT_STATE: "ryeong_event_state",
  QUESTIONS: "ryeong_questions",
  VOTES: "ryeong_votes",
  SCORES: "ryeong_scores",
  MY_PARTICIPANT: "ryeong_my_participant",
};

// 기본 행사 상태
export const defaultEventState: EventState = {
  currentSlideIndex: 0,
  currentProgramId: "registration",
  timerSeconds: 600,
  isTimerRunning: false,
  activeQuizId: "quiz-1",
  isQuizRevealed: false,
  isReactionEnabled: true,
  isVoteOpen: true,
  updatedAt: Date.now(),
};

// 기본 팀 점수판
export const defaultScores: TeamScore[] = [
  { id: "team-1", name: "1팀 짱구팀", score: 0, color: "bg-crayon-yellow" },
  { id: "team-2", name: "2팀 맹구팀", score: 0, color: "bg-crayon-pink" },
  { id: "team-3", name: "3팀 유리팀", score: 0, color: "bg-crayon-blue" },
  { id: "team-4", name: "4팀 철수팀", score: 0, color: "bg-crayon-green" },
];

class RealtimeHub {
  private broadcastChannel: BroadcastChannel | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  constructor() {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      this.broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
      this.broadcastChannel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type) {
          this.emitLocal(type, payload);
        }
      };

      // Storage 이벤트 리스너 (다른 탭의 동기화 보조)
      window.addEventListener("storage", (e) => {
        if (e.key === STORAGE_KEYS.EVENT_STATE && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            this.emitLocal("state_changed", parsed);
          } catch {
            // 파싱 실패 무시
          }
        }
      });
    }

    // Supabase 채널 구독 (설정된 경우)
    if (isSupabaseConfigured && supabase) {
      const channel = supabase.channel(CHANNEL_NAME);
      channel
        .on("broadcast", { event: "*" }, (payload) => {
          if (payload.event && payload.payload) {
            this.emitLocal(payload.event, payload.payload);
          }
        })
        .subscribe();
    }
  }

  // 로컬 이벤트 수신 등록
  public subscribe(eventType: string, callback: (data: any) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);

    return () => {
      this.listeners.get(eventType)?.delete(callback);
    };
  }

  // 내부 리스너 트리거
  private emitLocal(eventType: string, payload: any) {
    const subs = this.listeners.get(eventType);
    if (subs) {
      subs.forEach((cb) => {
        try {
          cb(payload);
        } catch {
          // 콜백 에러 안전 처리
        }
      });
    }
  }

  // 전체 브로드캐스트 (Supabase + BroadcastChannel)
  public broadcast(eventType: string, payload: any) {
    // 1) BroadcastChannel 전송
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ type: eventType, payload });
      } catch {
        // 브로드캐스트 에러 무시
      }
    }

    // 2) Supabase 채널 전송
    if (isSupabaseConfigured && supabase) {
      supabase.channel(CHANNEL_NAME).send({
        type: "broadcast",
        event: eventType,
        payload,
      });
    }

    // 3) 자기 자신에게도 로컬 반영
    this.emitLocal(eventType, payload);
  }

  // --- 상태 저장소 헬퍼 (로컬스토리지 + 실시간 전송) ---

  // 참가자 등록
  public registerParticipant(nickname: string): Participant {
    const newParticipant: Participant = {
      id: "user_" + Math.random().toString(36).substring(2, 9),
      nickname: nickname.trim(),
      joinedAt: Date.now(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.MY_PARTICIPANT, JSON.stringify(newParticipant));

      const list = this.getParticipants();
      if (!list.some((p) => p.nickname === newParticipant.nickname)) {
        list.push(newParticipant);
        localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(list));
      }
    }

    this.broadcast("participant_joined", newParticipant);
    return newParticipant;
  }

  // 내 참가자 정보 가져오기
  public getMyParticipant(): Participant | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEYS.MY_PARTICIPANT);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  // 전체 참가자 목록
  public getParticipants(): Participant[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  // 행사 상태 가져오기
  public getEventState(): EventState {
    if (typeof window === "undefined") return defaultEventState;
    const raw = localStorage.getItem(STORAGE_KEYS.EVENT_STATE);
    if (!raw) return defaultEventState;
    try {
      return { ...defaultEventState, ...JSON.parse(raw) };
    } catch {
      return defaultEventState;
    }
  }

  // 행사 상태 업데이트
  public updateEventState(partial: Partial<EventState>) {
    const current = this.getEventState();
    const next: EventState = {
      ...current,
      ...partial,
      updatedAt: Date.now(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.EVENT_STATE, JSON.stringify(next));
    }

    this.broadcast("state_changed", next);
    return next;
  }

  // 반응(리액션) 전송
  public sendReaction(emoji: string, participantId: string) {
    const reaction: ReactionEvent = {
      id: "rx_" + Math.random().toString(36).substring(2, 9),
      participantId,
      emoji,
      timestamp: Date.now(),
    };
    this.broadcast("reaction_received", reaction);
    return reaction;
  }

  // 투표/퀴즈 답안 제출
  public submitVote(vote: VoteAnswer) {
    if (typeof window !== "undefined") {
      const votes: VoteAnswer[] = this.getVotes();
      // 기존 투표 답변 대체 또는 추가
      const filtered = votes.filter(
        (v) => !(v.participantId === vote.participantId && v.questionId === vote.questionId)
      );
      filtered.push(vote);
      localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(filtered));
    }
    this.broadcast("vote_submitted", vote);
  }

  public getVotes(): VoteAnswer[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(STORAGE_KEYS.VOTES);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  // 익명 질문 전송
  public submitQuestion(content: string, senderName: string, participantId: string): AnonymousQuestion {
    const newQuestion: AnonymousQuestion = {
      id: "q_" + Math.random().toString(36).substring(2, 9),
      participantId,
      senderName,
      content: content.trim(),
      approved: false, // 기본 미승인
      createdAt: Date.now(),
    };

    if (typeof window !== "undefined") {
      const list = this.getQuestions();
      list.push(newQuestion);
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(list));
    }

    this.broadcast("question_submitted", newQuestion);
    return newQuestion;
  }

  public getQuestions(): AnonymousQuestion[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public approveQuestion(questionId: string, approved: boolean) {
    if (typeof window !== "undefined") {
      const list = this.getQuestions();
      const target = list.find((q) => q.id === questionId);
      if (target) {
        target.approved = approved;
        localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(list));
        this.broadcast("question_updated", target);
      }
    }
  }

  // 점수판 관리
  public getScores(): TeamScore[] {
    if (typeof window === "undefined") return defaultScores;
    const raw = localStorage.getItem(STORAGE_KEYS.SCORES);
    if (!raw) return defaultScores;
    try {
      return JSON.parse(raw);
    } catch {
      return defaultScores;
    }
  }

  public updateScore(teamId: string, delta: number) {
    const scores = this.getScores();
    const team = scores.find((s) => s.id === teamId);
    if (team) {
      team.score = Math.max(0, team.score + delta);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
      }
      this.broadcast("scores_updated", scores);
    }
    return scores;
  }
}

export const realtimeHub = new RealtimeHub();
