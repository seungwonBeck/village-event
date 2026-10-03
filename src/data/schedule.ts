/**
 * 못말리는 령고을 - 전체 행사 시간표 및 프로그램 정보
 */

export interface ScheduleItem {
  id: string;
  timeRange: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  title: string;
  subTitle?: string;
  description: string;
  iconName: string;
  badge?: string;
}

export const scheduleList: ScheduleItem[] = [
  {
    id: "registration",
    timeRange: "11:20 ~ 11:30",
    startTime: "11:20",
    endTime: "11:30",
    title: "등록 및 환영",
    subTitle: "반가워요! 령고을에 오신 것을 환영해요",
    description: "참가자 등록, 명찰 수령 및 QR 코드 접속 안내",
    iconName: "UserCheck",
  },
  {
    id: "opening",
    timeRange: "11:30 ~ 12:00",
    startTime: "11:30",
    endTime: "12:00",
    title: "오프닝 / 아이스브레이킹",
    subTitle: "어색함은 안녕! 신나는 첫 만남",
    description: "팀 빌딩, 팀명 정하기, 가벼운 몸풀기 게임",
    iconName: "Sparkles",
  },
  {
    id: "lunch",
    timeRange: "12:00 ~ 13:00",
    startTime: "12:00",
    endTime: "13:00",
    title: "점심 식사 & 교제",
    subTitle: "금강산도 식후경! 맛있는 점심",
    description: "맛있는 식사와 함께 나누는 첫 교제 시간",
    iconName: "Utensils",
  },
  {
    id: "recreation",
    timeRange: "13:00 ~ 13:45",
    startTime: "13:00",
    endTime: "13:45",
    title: "레크리에이션",
    subTitle: "못말리는 게임 배틀!",
    description: "팀 대항 흥미진진한 레크리에이션과 푸짐한 상품",
    iconName: "Gamepad2",
  },
  {
    id: "break",
    timeRange: "13:45 ~ 14:00",
    startTime: "13:45",
    endTime: "14:00",
    title: "쉬는 시간 & 찬양 준비",
    subTitle: "마음을 정돈하는 시간",
    description: "잠시 휴식 후 찬양을 준비합니다",
    iconName: "Coffee",
  },
  {
    id: "worship",
    timeRange: "14:00 ~ 14:30",
    startTime: "14:00",
    endTime: "14:30",
    title: "찬양",
    subTitle: "마음을 다해 부르는 노래",
    description: "아포슬 찬양팀과 함께 하나님을 높이는 시간",
    iconName: "Music",
  },
  {
    id: "message",
    timeRange: "14:30 ~ 15:00",
    startTime: "14:30",
    endTime: "15:00",
    title: "나눔 시간",
    subTitle: "세상의 빛 (마 5:16)",
    description: "우리를 부르신 그 자리에서 빛으로 살아가는 이야기를 함께 나눠요",
    iconName: "BookOpen",
  },
  {
    id: "prayer",
    timeRange: "15:00 ~ 15:30",
    startTime: "15:00",
    endTime: "15:30",
    title: "기도",
    subTitle: "마음을 모으는 간절한 기도",
    description: "사랑방과 공동체, 그리고 다음 발걸음을 위한 기도",
    iconName: "HeartHandshake",
  },
  {
    id: "closing",
    timeRange: "15:30 ~ 16:00",
    startTime: "15:30",
    endTime: "16:00",
    title: "마무리 & 단체 사진",
    subTitle: "오늘도 못말리는 령고을이었습니다!",
    description: "시상식, 사랑방 발표, 단체 사진 촬영 및 작별 인사",
    iconName: "Camera",
  },
];

export const schedule = scheduleList.map((item) => ({
  time: item.timeRange,
  title: item.title,
}));

