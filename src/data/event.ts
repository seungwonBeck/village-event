/**
 * 못말리는 령고을 - 행사 기본 정보 데이터
 * 대구동신교회 청년 아포슬 3팀
 */

export interface EventInfo {
  church: string;
  ministry: string;
  title: string;
  subTitle: string;
  bibleVerse: string;
  themeVerseContent: string;
  date: string;
  displayDate: string;
  shortDate: string; // 화면 배지·배너용 짧은 날짜
  eventLabel: string; // 슬라이드 상단 공통 라벨
  startTime: string;
  endTime: string;
  location: string;
  targetCount?: string;
}

export const event: EventInfo = {
  church: "대구동신교회",
  ministry: "청년 아포슬 3팀",
  title: "못말리는 령고을",
  subTitle: "우리들의 못말리는 하루가 시작됩니다!",
  bibleVerse: "마태복음 5:16",
  themeVerseContent:
    "이같이 너희 빛이 사람 앞에 비치게 하여 그들로 너희 착한 행실을 보고 하늘에 계신 너희 아버지께 영광을 돌리게 하라",
  date: "2026-10-03",
  displayDate: "10월 3일 토요일",
  shortDate: "2026. 10. 03 (토)",
  eventLabel: "대구동신교회 청년 아포슬 3팀 김령희 고을행사",
  startTime: "11:30",
  endTime: "16:00",
  location: "비전관 4층 소망홀",
  targetCount: "약 20~30명",

  // TODO: 설교자 결정 후 입력 (예: "김동신 목사", "이아포슬 전도사")
};
