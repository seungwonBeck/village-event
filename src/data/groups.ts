/**
 * 못말리는 령고을 - 가장(리더) 소개 데이터
 * 호칭 규칙:
 * - 김령희 을장님
 * - 이채희 부가장님
 * - 홍평안 가장님
 * - 양혜선 가장님
 * - 백승원 가장님
 * - 이상희 가장님
 * - 김고은 가장님
 */

export type CharacterKey = "shiro" | "himawari" | "nene" | "bo" | "kazama" | "hero" | "masao" | "shinchan";

export interface LeaderGroupItem {
  id: string;
  roleTitle: string; // "을장님" | "부가장님" | "가장님"
  displayName: string; // 예: "김령희 을장님", "김고은 가장님"
  name: string; // "김령희 을장", "김고은 가장"
  leaderName: string; // "김령희", "김고은"
  leader: string; // "김령희", "김고은"
  generation: string;
  character: CharacterKey;
  characterName: string;
  color: string;
  members?: string[];
  motto?: string;
  image: string;
}

export type GroupItem = LeaderGroupItem;
export type CommunityGroup = LeaderGroupItem;

export const groups: LeaderGroupItem[] = [
  {
    id: "ryeonghee",
    roleTitle: "을장님",
    displayName: "김령희 을장님",
    name: "김령희 을장",
    leaderName: "김령희",
    leader: "김령희",
    generation: "97또래 · 총괄 리더",
    character: "hero",
    characterName: "을장님",
    color: "bg-[#dff2df]",
    members: [],
    motto: "사랑과 은혜가 넘쳐흐르는 못말리는 령고을로 환영합니다!",
    image: "/images/event/group-kim-ryeonghee.png",
  },
  {
    id: "goeun",
    roleTitle: "가장님",
    displayName: "김고은 가장님",
    name: "김고은 가장",
    leaderName: "김고은",
    leader: "김고은",
    generation: "98또래",
    character: "bo",
    characterName: "가장님",
    color: "bg-[#eef1c8]",
    members: ["김고은 (98또래)", "김군택 (99또래)", "김영욱 (99또래)", "김예은 (99또래)", "이대열 (99또래)", "전미정 (98또래)", "황수정 (99또래)", "김은강 (98또래)"],
    motto: "세상의 빛으로 활짝 피어나는 가장 젊고 푸른 우리 사랑방!",
    image: "/images/event/group-kim-goeun.png",
  },
  {
    id: "seungwon",
    roleTitle: "가장님",
    displayName: "백승원 가장님",
    name: "백승원 가장",
    leaderName: "백승원",
    leader: "백승원",
    generation: "97또래",
    character: "kazama",
    characterName: "가장님",
    color: "bg-[#dfeeff]",
    members: ["백승원 (97또래)", "김다은 (99또래)", "김다혜 (98또래)"],
    motto: "든든한 믿음의 동역자로 날마다 함께 세워져가기!",
    image: "/images/event/group-baek-seungwon.png",
  },
  {
    id: "yang",
    roleTitle: "가장님",
    displayName: "양혜선 가장님",
    name: "양혜선 가장",
    leaderName: "양혜선",
    leader: "양혜선",
    generation: "97또래",
    character: "himawari",
    characterName: "가장님",
    color: "bg-[#fff0b9]",
    members: ["양혜선 (97또래)", "이채희 (97또래)", "정효재 (98또래)", "우호정 (99또래)", "김형윤 (98또래)", "임희진 (99또래)", "김은별 (97또래)", "김정연 (97또래)"],
    motto: "빛과 사랑으로 서로를 품어주는 따뜻한 공동체!",
    image: "/images/event/group-yang-hyeseon.png",
  },
  {
    id: "jaehee",
    roleTitle: "부가장님",
    displayName: "이채희 부가장님",
    name: "이채희 부가장",
    leaderName: "이채희",
    leader: "이채희",
    generation: "97또래",
    character: "nene",
    characterName: "부가장님",
    color: "bg-[#ffe0ed]",
    members: [],
    motto: "함께 웃고 기뻐하며 하나님의 빛을 비추는 귀한 시간!",
    image: "/images/event/group-yang-hyeseon-jaehee.png",
  },
  {
    id: "sanghee",
    roleTitle: "가장님",
    displayName: "이상희 가장님",
    name: "이상희 가장",
    leaderName: "이상희",
    leader: "이상희",
    generation: "98또래",
    character: "masao",
    characterName: "가장님",
    color: "bg-[#ffead4]",
    members: [
      "이상희 (98또래)",
      "강은지 (99또래)",
      "김도진 (99또래)",
      "이대희 (97또래)",
      "우지훈 (97또래)",
      "권수진 (98또래)",
      "조기준 (97또래)",
    ],
    motto: "기쁨과 감사가 넘치는 못말리는 우리 방!",
    image: "/images/event/group-lee-sanghee.png",
  },
  {
    id: "hong",
    roleTitle: "가장님",
    displayName: "홍평안 가장님",
    name: "홍평안 가장",
    leaderName: "홍평안",
    leader: "홍평안",
    generation: "97또래",
    character: "shiro",
    characterName: "가장님",
    color: "bg-[#e6f5fc]",
    members: ["홍평안 (97또래)", "권재민 (98또래)", "천유신 (99또래)", "우홍정 (97또래)"],
    motto: "주 안에서 항상 평안하고 기뻐하는 우리 식구들!",
    image: "/images/event/group-hong-pyeongan.png",
  },
];
