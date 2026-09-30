/**
 * 못말리는 령고을 - 찬양 플레이리스트 및 가사 데이터
 * 가사는 프로젝터에서 멀리서도 잘 보이도록 한 슬라이드당 2~4줄씩 구성됩니다.
 */

export interface SongSlide {
  slideIndex: number;
  lines: string[];
}

export interface WorshipSong {
  id: string;
  title: string;
  artist: string;
  key?: string;
  youtubeUrl?: string;
  slides: SongSlide[]; // 화면에 2~4줄씩 끊어서 보여줄 가사 슬라이드
}

const rawWorshipPlaylist: WorshipSong[] = [
  {
    id: "song-1",
    title: "정직한 예배",
    artist: "제이어스",
    key: "F Major → Gb Major",
    slides: [
      {
        slideIndex: 1,
        lines: ["나의 눈 열어 주를 보게 하소서", "정직한 예배 순전한 맘을 드리네"],
      },
      {
        slideIndex: 2,
        lines: ["빗나간 나의 소망 주께로 돌이키며", "오직 주님만 사랑하게 하소서"],
      },
      {
        slideIndex: 3,
        lines: ["나의 눈 열어 주를 보게 하소서", "정직한 예배 순전한 맘을 드리네"],
      },
      {
        slideIndex: 4,
        lines: ["빗나간 나의 소망 주께로 돌이키며", "오직 주님만 사랑하게 하소서"],
      },
      {
        slideIndex: 5,
        lines: ["나의 눈 열어 주를 보게 하소서", "정직한 예배 순전한 맘을 드리네"],
      },
      {
        slideIndex: 6,
        lines: ["빗나간 나의 소망 주께로 돌이키며", "오직 주님만 사랑하게 하소서"],
      },
      {
        slideIndex: 7,
        lines: ["나의 눈 열어 주를 보게 하소서", "정직한 예배 순전한 맘을 드리네"],
      },
      {
        slideIndex: 8,
        lines: ["빗나간 나의 소망 주께로 돌이키며", "오직 주님만 사랑하게 하소서"],
      },
      {
        slideIndex: 9,
        lines: ["나의 눈 열어 주를 보게 하소서", "정직한 예배 순전한 맘을 드리네"],
      },
      {
        slideIndex: 10,
        lines: ["빗나간 나의 소망 주께로 돌이키며", "오직 주님만 사랑하게 하소서"],
      },
      {
        slideIndex: 11,
        lines: ["영과 진리로 예배하네", "영과 진리로 예배하네"],
      },
      {
        slideIndex: 12,
        lines: ["영과 진리로 예배하네", "영과 진리로 예배하네"],
      },
      {
        slideIndex: 13,
        lines: ["영과 진리로 예배하네", "영과 진리로 예배하네"],
      },
      {
        slideIndex: 14,
        lines: ["나의 눈 열어 주를 보게 하소서", "정직한 예배 순전한 맘을 드리네"],
      },
      {
        slideIndex: 15,
        lines: ["빗나간 나의 소망 주께로 돌이키며", "오직 주님만 사랑하게 하소서"],
      },
      {
        slideIndex: 16,
        lines: ["나의 눈 열어 주를 보게 하소서", "정직한 예배 순전한 맘을 드리네"],
      },
      {
        slideIndex: 17,
        lines: ["빗나간 나의 소망 주께로 돌이키며", "오직 주님만 사랑하게 하소서"],
      },
      {
        slideIndex: 18,
        lines: ["나의 눈 열어 주를 보게 하소서", "정직한 예배 순전한 맘을 드리네"],
      },
      {
        slideIndex: 19,
        lines: ["빗나간 나의 소망 주께로 돌이키며", "오직 주님만 사랑하게 하소서"],
      },
    ],
  },
  {
    id: "song-2",
    title: "높이 계신 주께",
    artist: "방민우 (J-US)",
    key: "E Major",
    slides: [
      {
        slideIndex: 1,
        lines: ["내 높이 계신 주께 영광을 돌리리", "나의 영원하신 기업 또 만유의 주께"],
      },
      {
        slideIndex: 2,
        lines: ["그 높고 높은 위엄 말로 다 못해도", "내 삶으로 드리고 싶어"],
      },
      {
        slideIndex: 3,
        lines: ["내 높이 계신 주께 영광을 돌리리", "감히 비교할 수 없는 지혜와 그 사랑"],
      },
      {
        slideIndex: 4,
        lines: ["그 높고 높은 위엄 말로 다 못해도", "내 삶으로 드리고 싶어"],
      },
      {
        slideIndex: 5,
        lines: ["높고 놀라운 주 이름", "내 영이 주를 찬송하며 기뻐 뛰겠네"],
      },
      {
        slideIndex: 6,
        lines: ["높고 놀라운 주 이름", "내 영이 주를 찬송하며 기뻐 노래해"],
      },
      {
        slideIndex: 7,
        lines: ["내 높이 계신 주께 영광을 돌리리", "나의 영원하신 기업 또 만유의 주께"],
      },
      {
        slideIndex: 8,
        lines: ["그 높고 높은 위엄 말로 다 못해도", "내 삶으로 드리고 싶어"],
      },
      {
        slideIndex: 9,
        lines: ["내 높이 계신 주께 영광을 돌리리", "감히 비교할 수 없는 지혜와 그 사랑"],
      },
      {
        slideIndex: 10,
        lines: ["그 높고 높은 위엄 말로 다 못해도", "내 삶으로 드리고 싶어"],
      },
      {
        slideIndex: 11,
        lines: ["높고 놀라운 주 이름", "내 영이 주를 찬송하며 기뻐 뛰겠네"],
      },
      {
        slideIndex: 12,
        lines: ["높고 놀라운 주 이름", "내 영이 주를 찬송하며 기뻐 노래해"],
      },
      {
        slideIndex: 13,
        lines: ["높고 놀라운 주 이름", "내 영이 주를 찬송하며 기뻐 뛰겠네"],
      },
      {
        slideIndex: 14,
        lines: ["높고 놀라운 주 이름", "내 영이 주를 찬송하며 기뻐 노래해"],
      },
      {
        slideIndex: 15,
        lines: ["형언할 수 없는 그 놀라운 사랑", "은혜와 진리로 새롭게 하신"],
      },
      {
        slideIndex: 16,
        lines: ["십자가의 보혈 그 놀라운 은혜"],
      },
      {
        slideIndex: 17,
        lines: ["형언할 수 없는 그 놀라운 사랑", "은혜와 진리로 새롭게 하신"],
      },
      {
        slideIndex: 18,
        lines: ["십자가의 보혈 그 놀라운 은혜"],
      },
      {
        slideIndex: 19,
        lines: ["높고 놀라운 주 이름", "내 영이 주를 찬송하며 기뻐 뛰겠네"],
      },
      {
        slideIndex: 20,
        lines: ["높고 놀라운 주 이름", "내 영이 주를 찬송하며 기뻐 노래해"],
      },
      {
        slideIndex: 21,
        lines: ["높고 놀라운 주 이름", "내 영이 주를 찬송하며 기뻐 뛰겠네"],
      },
      {
        slideIndex: 22,
        lines: ["높고 놀라운 주 이름", "내 영이 주를 찬송하며 기뻐 노래해"],
      },
      {
        slideIndex: 23,
        lines: ["높고 놀라운 주 이름", "내 영이 주를 찬송하며 기뻐 뛰겠네"],
      },
      {
        slideIndex: 24,
        lines: ["높고 놀라운 주 이름", "내 영이 주를 찬송하며 기뻐 노래해"],
      },
      {
        slideIndex: 25,
        lines: ["높고 놀라운 주 이름", "내 영이 주를 찬송하며 기뻐 뛰겠네"],
      },
      {
        slideIndex: 26,
        lines: ["높고 놀라운 주 이름", "내 영이 주를 찬송하며 기뻐 노래해"],
      },
    ],
  },
  {
    id: "song-3",
    title: "불을 내려 주소서",
    artist: "천관웅",
    key: "C Major",
    slides: [
      {
        slideIndex: 1,
        lines: ["나는 아네 내가 살아가는 이유", "불이 되는 것"],
      },
      {
        slideIndex: 2,
        lines: ["작은 불이 큰 산 모두 태우듯이", "나를 쓰소서"],
      },
      {
        slideIndex: 3,
        lines: ["불을 내려주소서", "내게 성령의 불을"],
      },
      {
        slideIndex: 4,
        lines: ["죽어진 영혼 살릴 수 있도록", "나를 태워주소서"],
      },
      {
        slideIndex: 5,
        lines: ["제단위에 나를 드리니", "열방의 불로 세우소서"],
      },
      {
        slideIndex: 6,
        lines: ["주 발 앞에 신을 벗고", "기도하니 불을 주소서"],
      },
      {
        slideIndex: 7,
        lines: ["성령으로 연단 받은", "불의 사람 되게 하소서"],
      },
      {
        slideIndex: 8,
        lines: ["불을 내려주소서", "내게 성령의 불을"],
      },
      {
        slideIndex: 9,
        lines: ["죽어진 영혼 살릴 수 있도록", "나를 태워주소서"],
      },
      {
        slideIndex: 10,
        lines: ["제단위에 나를 드리니", "열방의 불로 세우소서"],
      },
      {
        slideIndex: 11,
        lines: ["태우소서 부으소서", "성령의 불을"],
      },
      {
        slideIndex: 12,
        lines: ["태우소서 부으소서", "성령의 불을"],
      },
      {
        slideIndex: 13,
        lines: ["불을 내려주소서", "내게 성령의 불을"],
      },
      {
        slideIndex: 14,
        lines: ["죽어진 영혼 살릴 수 있도록", "나를 태워주소서"],
      },
      {
        slideIndex: 15,
        lines: ["제단위에 나를 드리니", "열방의 불로 세우소서"],
      },
      {
        slideIndex: 16,
        lines: ["불을 내려주소서", "내게 성령의 불을"],
      },
      {
        slideIndex: 17,
        lines: ["죽어진 영혼 살릴 수 있도록", "나를 태워주소서"],
      },
      {
        slideIndex: 18,
        lines: ["제단위에 나를 드리니", "열방의 불로 세우소서"],
      },
    ],
  },
  {
    id: "song-4",
    title: "예배하는 이에게",
    artist: "김진호",
    key: "Eb Major",
    slides: [
      {
        slideIndex: 1,
        lines: ["주님만이 나를 아시네", "내 모든 삶 주가 만지시네"],
      },
      {
        slideIndex: 2,
        lines: ["주님 앞에 예배하는 이에게", "큰 은혜를 부어주시리"],
      },
      {
        slideIndex: 3,
        lines: ["주님만이 나를 아시네", "내 모든 삶 주가 만지시네"],
      },
      {
        slideIndex: 4,
        lines: ["주님 앞에 예배하는 이에게", "큰 은혜를 부어주시리"],
      },
      {
        slideIndex: 5,
        lines: ["만왕의 왕", "나를 기르시는 목자요"],
      },
      {
        slideIndex: 6,
        lines: ["내 모든 삶", "주가 다스리시니"],
      },
      {
        slideIndex: 7,
        lines: ["주님 뜻을 따르길 원하네", "오 주 한분만 바라네"],
      },
      {
        slideIndex: 8,
        lines: ["주님만이 나를 아시네", "내 모든 삶 주가 만지시네"],
      },
      {
        slideIndex: 9,
        lines: ["만왕의 왕", "나를 기르시는 목자요"],
      },
      {
        slideIndex: 10,
        lines: ["내 모든 삶", "주가 다스리시니"],
      },
      {
        slideIndex: 11,
        lines: ["주님 뜻을 따르길 원하네", "오 주 한분만 바라네"],
      },
      {
        slideIndex: 12,
        lines: ["주님만이 나를 아시네", "내 모든 삶 주가 만지시네"],
      },
      {
        slideIndex: 13,
        lines: ["주님 앞에 예배하는 이에게", "큰 은혜를 부어주시리"],
      },
      {
        slideIndex: 14,
        lines: ["주님만이 나를 아시네", "내 모든 삶 주가 만지시네"],
      },
      {
        slideIndex: 15,
        lines: ["주님 앞에 예배하는 이에게", "큰 은혜를 부어주시리"],
      },
      {
        slideIndex: 16,
        lines: ["주님만이 온 땅의 소망", "내 삶 속의 유일한 자랑이라"],
      },
      {
        slideIndex: 17,
        lines: ["주님 앞에 기도하는 이에게", "큰 은혜를 부어주시리"],
      },
      {
        slideIndex: 18,
        lines: ["만왕의 왕", "나를 기르시는 목자요"],
      },
      {
        slideIndex: 19,
        lines: ["내 모든 삶", "주가 다스리시니"],
      },
      {
        slideIndex: 20,
        lines: ["주님 뜻을 따르길 원하네", "오 주 한분만 바라네"],
      },
      {
        slideIndex: 21,
        lines: ["주님만이 나를 아시네", "내 모든 삶 주가 만지시네"],
      },
      {
        slideIndex: 22,
        lines: ["만왕의 왕", "나를 기르시는 목자요"],
      },
      {
        slideIndex: 23,
        lines: ["내 모든 삶", "주가 다스리시니"],
      },
      {
        slideIndex: 24,
        lines: ["주님 뜻을 따르길 원하네", "오 주 한분만 바라네"],
      },
      {
        slideIndex: 25,
        lines: ["주님만이 나를 아시네", "내 모든 삶 주가 만지시네"],
      },
      {
        slideIndex: 26,
        lines: ["주님만이 나를 아시네", "내 모든 삶 주가 만지시네"],
      },
      {
        slideIndex: 27,
        lines: ["주님 앞에 예배하는 이에게", "큰 은혜를 부어주시리"],
      },
      {
        slideIndex: 28,
        lines: ["주님만이 나를 아시네", "내 모든 삶 주가 만지시네"],
      },
      {
        slideIndex: 29,
        lines: ["주님 앞에 예배하는 이에게", "큰 은혜를 부어주시리"],
      },
    ],
  },
  {
    id: "song-5",
    title: "찬양의 열기 (마음의 예배)",
    artist: "Matt Redman / 천관웅 역",
    key: "D Major",
    slides: [
      {
        slideIndex: 1,
        lines: ["찬양의 열기 모두 끝나면", "주 앞에 나와"],
      },
      {
        slideIndex: 2,
        lines: ["더욱 진실한 예배드리네", "주님을 향한"],
      },
      {
        slideIndex: 3,
        lines: ["찬양의 열기 모두 끝나면", "주 앞에 나와"],
      },
      {
        slideIndex: 4,
        lines: ["더욱 진실한 예배드리네", "주님을 향한"],
      },
      {
        slideIndex: 5,
        lines: ["노래 이상의 노래", "내 맘 깊은 곳에 주께서 원하신 것"],
      },
      {
        slideIndex: 6,
        lines: ["화려한 음악보다 뜻 없는 열정보다", "중심을 원하시죠"],
      },
      {
        slideIndex: 7,
        lines: ["주님께 드릴 마음의 예배", "주님을 위한 주님을 향한 노래"],
      },
      {
        slideIndex: 8,
        lines: ["중심 잃은 예배 내려놓고", "이제 나 돌아와 주님만 예배해요"],
      },
      {
        slideIndex: 9,
        lines: ["영원하신 왕", "표현치 못할 주님의 존귀"],
      },
      {
        slideIndex: 10,
        lines: ["가난할 때도 연약할 때도", "주 내 모든 것"],
      },
      {
        slideIndex: 11,
        lines: ["노래 이상의 노래", "내 맘 깊은 곳에 주께서 원하신 것"],
      },
      {
        slideIndex: 12,
        lines: ["화려한 음악보다 뜻 없는 열정보다", "중심을 원하시죠"],
      },
      {
        slideIndex: 13,
        lines: ["노래 이상의 노래", "내 맘 깊은 곳에 주께서 원하신 것"],
      },
      {
        slideIndex: 14,
        lines: ["화려한 음악보다 뜻 없는 열정보다", "중심을 원하시죠"],
      },
      {
        slideIndex: 15,
        lines: ["주님께 드릴 마음의 예배", "주님을 위한 주님을 향한 노래"],
      },
      {
        slideIndex: 16,
        lines: ["중심 잃은 예배 내려놓고", "이제 나 돌아와 주님만 예배해요"],
      },
      {
        slideIndex: 17,
        lines: ["주님께 드릴 마음의 예배", "주님을 위한 주님을 향한 노래"],
      },
      {
        slideIndex: 18,
        lines: ["중심 잃은 예배 내려놓고", "이제 나 돌아와 주님만 예배해요"],
      },
      {
        slideIndex: 19,
        lines: ["찬양의 열기 모두 끝나면", "주 앞에 나와"],
      },
      {
        slideIndex: 20,
        lines: ["더욱 진실한 예배드리네", "주님을 향한"],
      },
    ],
  },

];

// 가사 페이지 배열(한 페이지 = 화면 한 장)을 SongSlide로 변환
const toSlides = (pages: string[][]): SongSlide[] =>
  pages.map((lines, i) => ({ slideIndex: i + 1, lines }));

/**
 * 기도회 찬양 (합심기도 시간에 부르는 곡) - 악보 기준
 */
const rawPrayerPlaylist: WorshipSong[] = [
  {
    id: "prayer-song-1",
    title: "나를 세상의 빛으로",
    artist: "Scott Brenner / 제이어스 편곡",
    key: "D Major",
    slides: toSlides([
      ["나를 세상의 빛으로", "부르신 주님 비추소서"],
      ["나도 주님의 빛을 비추리라"],
      ["어둠을 밝히는 빛", "온 세상을 비추는 빛"],
      ["산 위의 마을이", "숨기지 못하네"],
    ]),
  },
  {
    id: "prayer-song-2",
    title: "완전하신 나의 주",
    artist: "미확인",
    key: "E Major",
    slides: toSlides([
      ["완전하신 나의 주", "나의 길로 날 인도하소서"],
      ["행하신 모든 일 주님의 영광", "다 경배합니다 예배합니다"],
      ["찬양합니다 주님만 날 다스리소서", "예배합니다"],
      ["찬양합니다", "주님 홀로 높임 받으소서"],
    ]),
  },
  {
    id: "prayer-song-3",
    title: "당신이 지쳐서 (누군가 널 위해)",
    artist: "Lanny Wolfe",
    key: "G Major",
    slides: toSlides([
      ["당신이 지쳐서 기도할 수 없고", "눈물이 빗물처럼 흘러내릴 때"],
      ["주님은 아시네", "당신의 약함을 사랑으로 인도하시네"],
      ["당신이 외로이 홀로 남았을 때", "당신은 누구에게 위로를 얻나"],
      ["주님은 아시네", "당신의 마음을 그대 홀로 있지 못함을"],
      ["누군가 널 위하여", "누군가 기도하네"],
      ["네가 홀로 외로워서 마음이 무너질 때", "누군가 널 위해 기도하네"],
    ]),
  },
  {
    id: "prayer-song-4",
    title: "꿈꾸는 자를 위한 축복송",
    artist: "이영진 (Team Luke Worship)",
    key: "D Major",
    slides: toSlides([
      ["하나님 주신 열방을", "치유하는 거룩한 꿈을 꾸는 당신은"],
      ["세상이 감당치 못할", "믿음의 사람입니다"],
    ]),
  },
  {
    id: "prayer-song-5",
    title: "주의 성소로",
    artist: "아이자야씩스티원 (Isaiah 6tyOne)",
    key: "F Major",
    slides: toSlides([
      ["주의 성소로 들어가네", "주의 말씀 있는 곳"],
      ["죄 씻음과 참 안식을", "누리겠네"],
      ["주의 성소로 들어가서", "참 평안 얻겠네"],
      ["큰 기쁨과 참 자유로", "찬양드리리"],
      ["주님 앞에 나오라", "감사함으로 나오라"],
      ["신실하시며 자비로우신", "주님 앞에 나오라"],
      ["주님 앞에 나아갑니다", "주의 사랑의 품에"],
      ["크고 놀라운 사랑", "날 온전케 하시네"],
    ]),
  },
  {
    id: "prayer-song-6",
    title: "무너짐 가운데서",
    artist: "WELOVE (위러브)",
    key: "C Major",
    slides: toSlides([
      ["나 다시 예수께 돌아가려 하네", "넋을 잃고 잃어버린 예배의 자리로"],
      ["나 다시 예수께 돌아가려 하네", "주의 성실을 의지해 연약한 모습으로"],
      ["아버지께서 일하고 계시네", "고요한 날들이 아득하여도"],
      ["예수 그리스도 주의 이름이", "그 약속을 이루셨듯이 영원히 있겠네"],
      ["믿음과 소망 그리고 사랑", "아버지와 그의 아들"],
      ["당신의 영이 우리와 함께", "영원히"],
    ]),
  },
];

// 같은 가사 화면은 한 번만 남기고 번호를 다시 매긴다 (반복 구간은 가사 네비게이션으로 바로 이동)
const dedupeSlides = (song: WorshipSong): WorshipSong => {
  const seen = new Set<string>();
  const slides = song.slides
    .filter((slide) => {
      const key = slide.lines.join("|");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((slide, i) => ({ ...slide, slideIndex: i + 1 }));
  return { ...song, slides };
};

export const worshipPlaylist: WorshipSong[] = rawWorshipPlaylist.map(dedupeSlides);
export const prayerPlaylist: WorshipSong[] = rawPrayerPlaylist.map(dedupeSlides);
