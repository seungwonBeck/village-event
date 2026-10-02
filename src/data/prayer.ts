/**
 * 못말리는 령고을 - 기도 제목 데이터
 * 관리자 페이지(/admin/content) 또는 이 파일에서 직접 수정 가능합니다.
 */

export interface PrayerTopic {
  id: string;
  category: string;
  title: string;
  description: string;
  bibleRef?: string;
}

export const defaultPrayerTopics: PrayerTopic[] = [
  { id: "prayer-1", category: "찬양과 감사", title: "하나님의 아름다우심과 감사를 우리의 입술로 고백합시다", description: "" },
  { id: "prayer-2", category: "회개", title: "무너졌던 나의 삶과 예배를 되돌아보고 회개합시다", description: "" },
  { id: "prayer-3", category: "회복", title: "연약한 나와 함께 하시는 하나님을 바라봅시다", description: "" },
  { id: "prayer-4", category: "세상의 빛", title: "세상에 사랑으로 예수님을 드러낼 수 있길 기도합시다", description: "" },
  { id: "prayer-5", category: "예배", title: "나를 부르신 곳이 어딘지 & 마음을 지켜 예배할 수 있길 기도합시다", description: "" },
  { id: "prayer-6", category: "공동체", title: "공동체를 위해서 기도합시다", description: "" },
];
