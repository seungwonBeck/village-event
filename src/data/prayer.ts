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
  {
    id: "prayer-1",
    category: "개인의 믿음",
    title: "세상의 빛으로 살아가는 우리",
    description: "학교와 직장, 가정 가운데 그리스도의 향기와 빛을 비추며 선한 영향력을 흘려보내도록",
    bibleRef: "마태복음 5:16",
  },
  {
    id: "prayer-2",
    category: "공동체와 사랑방",
    title: "서로 사랑하며 하나 되는 아포슬 3팀",
    description: "새로 만난 사랑방 식구들과 서로를 깊이 이해하고 기도로 든든히 세워가는 따뜻한 공동체가 되도록",
    bibleRef: "요한복음 13:34",
  },
  {
    id: "prayer-3",
    category: "비전과 세상",
    title: "청년의 때에 하나님 나라를 꿈꾸며",
    description: "불안한 현실 속에서도 하나님께서 주신 비전을 붙들고 담대하게 세상으로 나아가도록",
    bibleRef: "잠언 16:9",
  },

  // TODO: 기도 인도자 및 팀 기도 제목 수령 후 추가/수정
];
