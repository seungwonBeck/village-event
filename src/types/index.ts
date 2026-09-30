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
  // 찬양/기도회 찬양 슬라이드별 가사 위치 (곡 번호, 가사 페이지) - 휴대폰 콘솔과 공유
  lyricPos?: Record<string, { song: number; page: number }>;
  // 합심 기도 슬라이드에서 선택한 기도 제목 번호
  prayerTopicIndex?: number;
  updatedAt: number;
}
