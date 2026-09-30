/**
 * 못말리는 령고을 - 실시간 퀴즈 & 투표 데이터
 */

export interface QuizQuestion {
  id: string;
  type: "quiz" | "vote";
  question: string;
  options: string[];
  correctAnswer?: number; // 퀴즈의 경우 정답 인덱스 (0~3)
  explanation?: string;
  points?: number;
}

export const defaultQuizzes: QuizQuestion[] = [
  {
    id: "quiz-1",
    type: "quiz",
    question: "오늘 행사의 주제 말씀인 마태복음 5:16에서 우리는 세상의 무엇일까요?",
    options: ["소금과 꿀", "세상의 빛", "빛과 망치", "세상의 불꽃"],
    correctAnswer: 1, // 1: 세상의 빛
    explanation: "마태복음 5:16 '이같이 너희 빛이 사람 앞에 비치게 하여...'",
    points: 10,
  },
  {
    id: "quiz-2",
    type: "vote",
    question: "오늘 점심 메뉴 중 가장 기대되는 스타일은?",
    options: [
      "든든한 고기 한상 (삼겹/제육)",
      "깔끔하고 맛있는 퓨전 덮밥",
      "분식 대잔치 (떡볶이/튀김/순대)",
      "신선하고 푸짐한 샌드위치 & 샐러드",
    ],
  },
  {
    id: "quiz-3",
    type: "quiz",
    question: "대구동신교회 청년 아포슬 3팀의 오늘 행사명은?",
    options: ["신나는 령고을", "못말리는 령고을", "놀라운 령고을", "떡잎 령고을"],
    correctAnswer: 1, // 1: 못말리는 령고을
    explanation: "오늘 우리의 모임 이름은 '못말리는 령고을'입니다!",
    points: 10,
  },
  {
    id: "quiz-4",
    type: "vote",
    question: "가장 친해지고 싶은 령고을 캐릭터는 누구인가요?",
    options: ["액션가면 짱구", "돌 모으기 장인 맹구", "리얼 소꿉놀이 유리", "완벽주의 엘리트 철수"],
  },

  // TODO: 당일 레크리에이션 및 퀴즈 진행팀 질문 수령 후 추가/수정
];
