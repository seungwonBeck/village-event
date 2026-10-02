/**
 * 못말리는 령고을 - 레크리에이션 게임 데이터
 */

export interface RecreationGame {
  id: number;
  title: string;
  duration: string; // 예: "10분"
  durationSeconds: number; // 타이머 기본 초
  description: string;
  rules: string[];
  tips?: string;
  questions?: string[]; // 게임용 랜덤 문제 목록
  // 조마다 따로 문제를 주는 게임용 (조별 문제 목록, 한 번 뽑은 문제는 다시 나오지 않는다)
  teamQuestions?: { teamId: string; label: string; questions: string[] }[];
}

export const recreationGames: RecreationGame[] = [
  {
    id: 1,
    title: "못말리는 텔레파시 만장일치",
    duration: "8분",
    durationSeconds: 480,
    description: "진행자의 제시어(A vs B)에 조원 전체가 동시에 같은 쪽을 선택해야 하는 단합 게임!",
    rules: [
      "진행자가 두 가지 선택지를 제시합니다 (예: 짜장 vs 짬뽕).",
      "하나, 둘, 셋 구호와 함께 조원 전원이 동시에 외칩니다.",
      "조원 전원의 선택이 100% 일치하면 +20점!",
      "한 명이라도 다르면 점수 획득 실패!",
    ],
    tips: "서로 미리 속삭이지 말고 직감으로 통일하세요!",
    questions: [
      "짜장면 vs 짬뽕",
      "양념치킨 vs 후라이드",
      "겨울 vs 여름",
      "산 vs 바다",
      "찍먹 vs 부먹",
      "아침형 인간 vs 올빼미형 인간",
      "민트초코 vs 반민초",
      "물냉면 vs 비빔냉면",
      "고양이 vs 강아지",
      "집콕 vs 밖콕",
      "카톡 vs 전화",
      "계획형 vs 즉흥형",
    ],
  },
  {
    id: 2,
    title: "전원 가위바위보",
    duration: "5분",
    durationSeconds: 300,
    description: "참가자 전원이 진행자와 가위바위보! 마지막까지 살아남은 인원이 많은 조가 승리!",
    rules: [
      "참가자 전원이 일어서서 진행자와 동시에 가위바위보를 합니다.",
      "진행자가 제시하는 대로 이기기 / 비기기 / 지기 중 하나를 내야 합니다.",
      "틀린 사람은 자리에 앉아 탈락합니다.",
      "마지막 라운드까지 살아남은 조원 1명당 +10점!",
    ],
    tips: "끝까지 집중! 옆 사람 손을 따라 내면 같이 탈락할 수 있어요.",
    questions: ["진행자를 이기세요! ✌️", "진행자와 비기세요! 🤝", "진행자에게 지세요! 🙇"],
  },
];
