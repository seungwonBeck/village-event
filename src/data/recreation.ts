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

// 몸으로 말해요 - 조마다 성경 인물 6개 + 대한민국 유명인 6개 (쉬움/보통/어려움이 고르게 섞이도록 배분)
const bodyTalkTeamQuestions = [
  {
    teamId: "team-1",
    label: "1팀",
    questions: ["노아", "유재석", "모세", "강호동", "아브라함", "이경규", "야곱", "박지성", "도마", "송강호", "사울", "안중근"],
  },
  {
    teamId: "team-2",
    label: "2팀",
    questions: ["다윗", "박명수", "골리앗", "손흥민", "요셉", "류현진", "솔로몬", "지드래곤", "가인", "이정재", "욥", "신사임당"],
  },
  {
    teamId: "team-3",
    label: "3팀",
    questions: ["삼손", "김연아", "요나", "싸이", "엘리야", "임영웅", "다니엘", "이효리", "기드온", "전지현", "사무엘", "김민재"],
  },
  {
    teamId: "team-4",
    label: "4팀",
    questions: ["아담", "아이유", "하와", "백종원", "바울", "김종국", "세례 요한", "추성훈", "한나", "박보검", "이삭", "박찬호"],
  },
  {
    teamId: "team-5",
    label: "5팀",
    questions: ["베드로", "마동석", "삭개오", "이순신 장군", "마리아", "세종대왕", "에스더", "유관순", "에서", "이강인", "나사로", "봉준호"],
  },
];

export const recreationGames: RecreationGame[] = [
  {
    id: 1,
    title: "몸으로 말해요 (인물 퀴즈)",
    duration: "팀당 3분",
    durationSeconds: 180,
    description: "성경 인물과 대한민국 유명인이 섞여 나오는 인물 문제를 몸짓으로만 설명해서 가장 많이 맞추는 팀이 승리!",
    rules: [
      "조마다 12문제가 준비되어 있고, 조 순서대로 한 팀씩 도전합니다.",
      "한 명이 제시어를 보고 몸짓과 표정으로만 설명하고, 나머지 조원이 정답을 맞춥니다.",
      "말소리와 입모양은 절대 금지! 오직 바디랭귀지만 허용됩니다.",
      "정답 하나당 +10점, 도저히 모를 때는 패스(PASS) 1회 사용 가능합니다.",
    ],
    tips: "성경 인물은 대표 장면(노아의 방주, 골리앗 물맷돌)을, 유명인은 시그니처 동작을 떠올려 보세요!",
    teamQuestions: bodyTalkTeamQuestions,
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
