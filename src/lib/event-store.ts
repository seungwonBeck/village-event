export type EventState = {
  currentSlide: number;
  currentProgram: string;
  reactionsEnabled: boolean;
  voteOpen: boolean;
  quizOpen: boolean;
  scores: Record<string, number>;
};

export const defaultEventState: EventState = {
  currentSlide: 0,
  currentProgram: "오프닝 / 아이스브레이킹",
  reactionsEnabled: true,
  voteOpen: true,
  quizOpen: false,
  scores: { 노랑팀: 0, 분홍팀: 0, 파랑팀: 0 },
};

export const EVENT_STATE_KEY = "reongoeul-event-state";
export const EVENT_CHANNEL = "reongoeul-event-update";

export function readEventState(): EventState {
  if (typeof window === "undefined") return defaultEventState;
  try {
    const saved = localStorage.getItem(EVENT_STATE_KEY);
    return saved ? { ...defaultEventState, ...JSON.parse(saved) } : defaultEventState;
  } catch {
    return defaultEventState;
  }
}

export function writeEventState(state: EventState) {
  localStorage.setItem(EVENT_STATE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent(EVENT_CHANNEL, { detail: state }));
}
