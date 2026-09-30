/**
 * 못말리는 령고을 - 통합 데이터 모델 타입 정의
 */

export interface Participant {
  id: string;
  nickname: string;
  joinedAt: number;
}

export interface ReactionEvent {
  id: string;
  participantId: string;
  emoji: string; // 👏 | 😂 | ❤️ | 🔥
  timestamp: number;
}

export interface AnonymousQuestion {
  id: string;
  participantId: string;
  senderName: string;
  content: string;
  approved: boolean;
  createdAt: number;
}

export interface VoteAnswer {
  participantId: string;
  questionId: string;
  optionIndex: number;
  timestamp: number;
}

export interface TeamScore {
  id: string;
  name: string;
  score: number;
  color: string;
}

export interface EventState {
  currentSlideIndex: number;
  currentProgramId: string;
  timerSeconds: number;
  isTimerRunning: boolean;
  activeQuizId: string | null;
  isQuizRevealed: boolean;
  isReactionEnabled: boolean;
  isVoteOpen: boolean;
  updatedAt: number;
}
