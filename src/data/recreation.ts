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
      "조마다 5문제가 준비되어 있고, 조 순서대로 한 팀씩 도전합니다.",
      "진행자가 두 가지 선택지를 제시합니다 (예: 치킨 vs 피자).",
      "하나, 둘, 셋 구호와 함께 조원 전원이 동시에 외칩니다.",
      "조원 전원의 선택이 일치하면 +20점!",
      "과반수 이상만 일치하면 +10점!",
      "과반수에 못 미치면 점수 획득 실패!",
    ],
    tips: "서로 미리 속삭이지 말고 직감으로 통일하세요!",
    // 조마다 5문제 + 예비 5문제 (30개 모두 주제가 겹치지 않는다)
    teamQuestions: [
      {
        teamId: "team-1",
        label: "1팀",
        questions: ["치킨 vs 피자", "국밥 vs 햄버거", "팥빙수 vs 아이스크림", "커피 vs 차", "순한 떡볶이 vs 매운 떡볶이"],
      },
      {
        teamId: "team-2",
        label: "2팀",
        questions: ["고기 vs 해산물", "밥 vs 빵", "영화관 vs 집에서 넷플릭스", "책 vs 영상", "지하철 vs 버스"],
      },
      {
        teamId: "team-3",
        label: "3팀",
        questions: ["롯데월드 vs 에버랜드", "해외여행 vs 국내여행", "캠핑 vs 호캉스", "벚꽃 vs 단풍", "해돋이 vs 노을"],
      },
      {
        teamId: "team-4",
        label: "4팀",
        questions: ["먼저 연락하기 vs 기다리기", "사진 찍기 vs 찍히기", "앞자리 vs 뒷자리", "칭찬받기 vs 선물받기", "걷기 vs 달리기"],
      },
      {
        teamId: "team-5",
        label: "5팀",
        questions: ["찬양 vs 기도", "성경 읽기 vs 성경 듣기", "주일 오전 vs 주일 오후", "조용한 기도 vs 통성기도", "소그룹 나눔 vs 전체 나눔"],
      },
      {
        teamId: "spare",
        label: "예비",
        questions: ["혼자 여행 vs 같이 여행", "붕어빵 vs 호떡", "게임 vs 운동", "스키 vs 스노보드", "놀이기구 vs 구경"],
      },
    ],
  },
  {
    id: 2,
    title: "단체 표현 (조별 5문제)",
    duration: "팀당 3분",
    durationSeconds: 180,
    description: "조마다 준비된 쉬운 동작 5개(성경 2 + 일상 3)를 조원 전원이 한 가지 동작으로 함께 표현하고, 나머지 조가 맞히는 게임!",
    rules: [
      "조마다 5문제가 준비되어 있고, 조 순서대로 한 팀씩 도전합니다.",
      "문제는 모두 한 가지 동작이에요! 조원 전원이 같은 동작을 다 같이 크게 보여주세요.",
      "다른 조가 정답을 맞히면 가장 먼저 맞힌 조 +10점, 표현한 조도 +10점!",
      "말소리와 입모양, 글자 쓰기는 절대 금지!",
    ],
    tips: "한 가지 동작만! 다 같이 동작을 크게 하면 더 잘 전달돼요.",
    teamQuestions: [
      {
        teamId: "team-1",
        label: "1팀",
        questions: ["기도하기", "라면 먹기", "찬양하기", "양치하기", "달리기"],
      },
      {
        teamId: "team-2",
        label: "2팀",
        questions: ["양 치기", "춤추기", "그물 던지기", "낚시하기", "사진 찍기"],
      },
      {
        teamId: "team-3",
        label: "3팀",
        questions: ["빵 나눠주기", "박수치기", "노 젓기", "줄넘기", "마이크 잡고 노래하기"],
      },
      {
        teamId: "team-4",
        label: "4팀",
        questions: ["성경 읽기", "우산 쓰기", "설교하기", "자전거 타기", "청소하기"],
      },
      {
        teamId: "team-5",
        label: "5팀",
        questions: ["무릎 꿇고 회개하기", "수영하기", "손 들고 환호하기", "잠자기", "축구하기"],
      },
    ],
  },
  {
    id: 3,
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
