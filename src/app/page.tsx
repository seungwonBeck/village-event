"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { Character } from "@/components/event-art";
import { ScheduleBoard } from "@/components/schedule-board";
import { event } from "@/data/event";
import { groups } from "@/data/groups";
import { scheduleList } from "@/data/schedule";
import { ChevronRight, ExternalLink, Image as ImageIcon, X } from "lucide-react";

/**
 * 못말리는 령고을 - 메인 페이지
 * 참고2 포스터 무드: 크림 종이 + 크레용 갈색 외곽선 + 스프링 노트 + 떡잎유치원
 */

// 시간표 데이터에서 시간대/시작시각을 가져와 문구를 한 곳에서만 관리
const getTimeRange = (id: string): string =>
  scheduleList.find((item) => item.id === id)?.timeRange ?? "";
const registrationStart = scheduleList[0].startTime;

// 사랑방 카드마다 살짝 다르게 기울여 손으로 붙여 놓은 느낌
const cardTilts = ["rotate-1", "-rotate-1", "rotate-2", "-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

// 사랑방별 캐릭터 한마디 뱃지
const characterTags: Record<string, string> = {
  sanghee: "🕶️ 선글라스 낀 훈이",
  ryeonghee: "⚡ 액션 짱구 을장",
  goeun: "🌸 꽃을 든 맹구",
  seungwon: "👉 엘리트 철수",
  yang: "🍼 귀염뽀짝 짱아",
  jaehee: "🎀 사랑스러운 유리",
  hong: "☁️ 포근한 흰둥이",
};

// 포스터의 반짝이 별: 위치/색만 바꿔 재사용
function Star({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute select-none leading-none ${className}`}>
      ★
    </span>
  );
}

// 마스킹 테이프로 붙인 제목 스티커
function TapeTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2
      className={`relative inline-block -rotate-1 rounded-2xl border-3 border-black bg-white px-5 py-2 text-3xl text-ink shadow-pop sm:text-5xl ${className}`}
    >
      <span aria-hidden="true" className="tape absolute -top-3 left-6 h-5 w-16 rotate-[-6deg]" />
      {children}
    </h2>
  );
}

export default function HomePage() {
  // 모달에 띄울 이미지 상태 관리 (시간표 원본 또는 가장님 소개 카드)
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    title: string;
    description?: string;
  } | null>(null);

  // 초대장 포스터 탭 선택 상태
  const [posterTab, setPosterTab] = useState<"vertical" | "wide">("vertical");

  return (
    <main className="min-h-screen overflow-x-clip bg-shin-paper text-ink selection:bg-shin-pink selection:text-white">
      <SiteHeader />

      {/* 1. 히어로: 포스터 구성 그대로 - 타이틀, 스프링 노트 안내, 짱구, 떡잎유치원 */}
      <section className="relative isolate overflow-hidden px-4 pb-24 pt-8 md:px-[80px] sm:pt-12">
        {/* 하단 유치원 풍경: 위쪽은 종이색으로 자연스럽게 사라지게 */}
        <Image
          src="/images/event/courtyard.png"
          alt=""
          aria-hidden="true"
          width={1672}
          height={941}
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[46%] w-full object-cover object-bottom [mask-image:linear-gradient(to_bottom,transparent,black_45%)]"
        />
        <Star className="left-[6%] top-10 rotate-12 text-3xl text-shin-yellow drop-shadow-[2px_2px_0_#3A2A1E]" />
        <Star className="right-[9%] top-16 -rotate-12 text-4xl text-shin-sky drop-shadow-[2px_2px_0_#3A2A1E]" />
        <Star className="left-[44%] top-[58%] rotate-6 text-2xl text-shin-pink drop-shadow-[2px_2px_0_#3A2A1E]" />

        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.15fr_1fr]">
          <div className="text-center md:text-left">
            <p className="inline-block -rotate-2 rounded-full border-3 border-black bg-white px-4 py-1.5 text-sm shadow-pop-sm sm:text-base">
              {event.church} {event.ministry}
            </p>

            <h1 className="mt-5 leading-[0.95] tracking-tight" aria-label={event.title}>
              <span aria-hidden="true" className="letter-stroke block -rotate-2 text-6xl text-shin-yellow sm:text-8xl">
                못말리는
              </span>
              <span aria-hidden="true" className="letter-stroke mt-1 block rotate-1 text-7xl sm:text-9xl">
                <span className="text-shin-pink">령</span>
                <span className="text-shin-sky">고</span>
                <span className="text-shin-pink">을</span>
              </span>
            </h1>

            <blockquote className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-ink/80 sm:text-base md:mx-0">
              &ldquo;{event.themeVerseContent}&rdquo;
              <footer className="mt-1 text-base">{event.bibleVerse}</footer>
            </blockquote>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            {/* 스프링 노트 안내장: 일시·장소·주제 */}
            <div className="relative rotate-1 rounded-3xl border-3 border-black bg-white px-5 pb-6 pt-9 shadow-pop-lg">
              <span aria-hidden="true" className="spiral absolute inset-x-4 top-2 h-5" />
              <dl className="space-y-3 text-base sm:text-lg">
                {[
                  { label: "일시", tone: "bg-shin-yellow", value: `${event.shortDate} ${event.startTime} ~ ${event.endTime}` },
                  { label: "장소", tone: "bg-shin-sky", value: event.location },
                  { label: "주제", tone: "bg-shin-pink text-white", value: `예배 (${event.bibleVerse})` },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <dt className={`shrink-0 rounded-lg border-2 border-black px-3 py-0.5 shadow-pop-sm ${row.tone}`}>
                      {row.label}
                    </dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* 짱구와 말풍선 */}
            <div className="relative mt-4 flex items-end justify-end gap-2">
              <p className="mb-24 -rotate-3 rounded-2xl border-3 border-black bg-white px-3 py-1.5 text-sm shadow-pop-sm">
                우리들의 못말리는 하루가
                <br />
                시작됩니다! ♥
              </p>
              <Character name="shinchan" label="환영하는 짱구" className="float-gently h-56 w-56 sm:h-80 sm:w-80" />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-4 flex max-w-6xl flex-wrap items-center justify-center gap-4 md:justify-start">
          <Link
            href="/join"
            className="inline-flex items-center gap-2 rounded-full border-3 border-black bg-shin-red px-8 py-3.5 text-xl text-white shadow-pop transition-transform hover:-translate-y-1 hover:shadow-pop-lg active:translate-y-0 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-shin-sky"
          >
            입장하기
            <ChevronRight className="h-5 w-5" />
          </Link>
          <a
            href="#schedule"
            className="rounded-full border-3 border-black bg-white px-6 py-3 text-lg shadow-pop-sm transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-shin-sky"
          >
            시간표 보기
          </a>
        </div>
      </section>

      {/* 2. 크레용 테이프 마퀴 */}
      <div aria-hidden="true" className="-rotate-1 overflow-hidden border-y-3 border-black bg-shin-yellow py-3 text-xl sm:text-2xl">
        <div className="marquee-track flex w-max items-center">
          {[0, 1].map((n) => (
            <div key={n} className="flex shrink-0 items-center gap-8 pr-8">
              <span>✨ 안녕, 령고을!</span>
              <span className="text-shin-red">♥</span>
              <span>서로 사랑하며 빛을 비추는 우리</span>
              <span className="text-shin-sky">★</span>
              <span>{event.shortDate} 함께해요</span>
              <span className="text-shin-pink">♥</span>
              <span>웃음도 은혜도 못말리게 풍성한 하루</span>
              <span className="text-shin-grass">★</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. 알림장: 오늘 하루 미리보기 */}
      <section id="about" className="px-4 py-20 md:px-[80px] sm:py-28">
        <div className="mx-auto max-w-6xl">
          <TapeTitle>오늘의 알림장</TapeTitle>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/80 sm:text-lg">
            각자의 빛깔을 가진 청년들이 모여 밥 먹고, 게임하고, 예배드려요. 서로의 이야기에 귀 기울이며 하나님을 높이는 하루예요.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              { emoji: "🍱", tone: "bg-[#FFE9A8]", tilt: "-rotate-2", title: "함께 먹는 점심", body: "금강산도 식후경! 맛있는 점심을 먹으며 어색함을 녹여요.", time: `${getTimeRange("lunch")} 점심 & 교제` },
              { emoji: "🎮", tone: "bg-[#FFC9E0]", tilt: "rotate-1", title: "못말리는 레크리에이션", body: "팀 대항 게임 배틀! 배꼽 빠지는 웃음과 푸짐한 상품이 기다려요.", time: `${getTimeRange("recreation")} 팀 게임 배틀` },
              { emoji: "🙏", tone: "bg-[#C9EEFB]", tilt: "-rotate-1", title: "뜨거운 찬양과 예배", body: "마음을 다해 찬양하고 말씀과 기도로 은혜를 채워요.", time: `${getTimeRange("worship").split(" ~ ")[0]} ~ ${getTimeRange("prayer").split(" ~ ")[1]} 찬양·말씀·기도` },
            ].map((card) => (
              <article
                key={card.title}
                className={`relative ${card.tilt} ${card.tone} rounded-3xl border-3 border-black p-6 pt-9 shadow-pop transition-transform hover:rotate-0`}
              >
                <span aria-hidden="true" className="tape absolute -top-3 left-1/2 h-5 w-20 -translate-x-1/2 rotate-2" />
                <div className="text-4xl">{card.emoji}</div>
                <h3 className="mt-3 text-2xl">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/80 sm:text-base">{card.body}</p>
                <p className="mt-5 border-t-2 border-dashed border-black/40 pt-3 text-base">⏰ {card.time}</p>
              </article>
            ))}
          </div>

          {/* 흰둥이 환영 */}
          <div className="mt-14 flex flex-col items-center gap-5 rounded-3xl border-3 border-black bg-white p-6 shadow-pop sm:flex-row sm:p-8">
            <Character name="shiro" label="흰둥이" className="h-24 w-20 shrink-0" />
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xl sm:text-2xl">&ldquo;새로 온 지체도, 오랜 친구도 모두 환영해!&rdquo;</p>
              <p className="mt-1 text-sm text-ink/70 sm:text-base">
                혼자 와도 어색하지 않게 가장님들과 사랑방 식구들이 따뜻하게 맞이해 드릴게요.
              </p>
            </div>
            <Link
              href="/join"
              className="shrink-0 rounded-full border-3 border-black bg-shin-yellow px-5 py-2.5 shadow-pop-sm transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-shin-sky"
            >
              참여 신청 확인
            </Link>
          </div>
        </div>
      </section>

      {/* 4. 칠판 시간표 */}
      <section id="schedule" className="px-4 pb-24 md:px-[80px]">
        <div className="mx-auto max-w-6xl rounded-3xl border-[10px] border-shin-wood bg-shin-board shadow-pop-lg">
          <div className="chalkboard rounded-2xl p-6 text-white sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end">
              <div>
                <h2 className="font-hand text-5xl leading-tight sm:text-6xl">
                  오늘의 <span className="crayon-underline text-white">시간표</span>
                </h2>
                <p className="mt-4 text-base leading-relaxed text-white/90 sm:text-lg">
                  설레는 첫 만남부터 기도와 마무리까지. 순서를 미리 보고 함께 준비해요.
                </p>
                <p className="mt-2 font-hand text-lg text-white/80">
                  현장 진행 상황은 휴대폰 화면(/live)에서도 볼 수 있어요.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-4 rounded-2xl border-3 border-black bg-white p-4 text-ink shadow-pop">
                  <Character name="hero" label="액션가면" className="h-16 w-16 shrink-0" />
                  <div>
                    <p className="font-hand text-lg text-shin-red">을장님의 꿀팁</p>
                    <p className="text-sm leading-snug sm:text-base">
                      &ldquo;{registrationStart}까지 여유롭게 도착해서 명찰을 받고 사랑방 지체들과 인사해요!&rdquo;
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedImage({
                      src: "/images/event/schedule-reference.png",
                      title: "못말리는 령고을 행사 시간표 원본",
                      description: "현장 상황에 따라 일부 순서가 조금씩 조정될 수 있습니다.",
                    })
                  }
                  className="mt-4 inline-flex items-center gap-2 rounded-full border-3 border-black bg-shin-yellow px-5 py-3 text-ink shadow-pop transition-transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-shin-sky"
                >
                  <ImageIcon className="h-4 w-4" />
                  시간표 원본 크게 보기
                </button>
              </div>
            </div>

            {/* 칠판에 붙인 노트: 시간표를 2열로 한 화면에 */}
            <div className="notebook relative mt-6 rounded-2xl border-3 border-black p-5 pt-8 text-ink shadow-pop-lg sm:p-6 sm:pt-9">
              <span aria-hidden="true" className="spiral absolute inset-x-4 top-2 h-5" />
              <div className="mb-4 flex items-center justify-between border-b-2 border-dashed border-black/30 pb-3">
                <h3 className="text-xl sm:text-2xl">프로그램 순서</h3>
                <span className="rounded-full border-2 border-black bg-shin-yellow px-3 py-0.5 text-sm">
                  총 {scheduleList.length}개
                </span>
              </div>
              <ScheduleBoard />
            </div>
          </div>
        </div>
      </section>

      {/* 5. 사랑방 가장님: 명찰 스티커 카드 */}
      <section id="community" className="px-4 pb-24 md:px-[80px]">
        <div className="mx-auto max-w-6xl">
          <TapeTitle className="rotate-1">우리 사랑방 가장님들</TapeTitle>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/80 sm:text-lg">
            각양각색 매력과 따뜻한 섬김으로 공동체를 이끄는 리더들이에요. 캐릭터와 함께 사랑방 분위기를 느껴보세요.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group, index) => (
              <article
                key={group.id}
                className={`group relative flex flex-col overflow-hidden rounded-3xl border-3 border-black bg-white shadow-pop transition-transform hover:rotate-0 ${cardTilts[index % cardTilts.length]}`}
              >
                <div className={`relative border-b-3 border-black p-5 ${group.color}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full border-2 border-black bg-white px-3 py-0.5 text-sm shadow-pop-sm">
                      {group.roleTitle}
                    </span>
                    <span className="text-sm">{group.generation}</span>
                  </div>
                  <div className="mx-auto mt-2 flex h-40 w-40 items-center justify-center transition-transform duration-300 group-hover:scale-110 sm:h-44 sm:w-44">
                    <Character name={group.character} label={`${group.leader} 가장님의 캐릭터`} className="h-full w-full" />
                  </div>
                  <p className="mt-2 text-center">
                    <span className="rounded-full border-2 border-black/40 bg-white/90 px-3 py-0.5 text-sm">
                      {characterTags[group.id]}
                    </span>
                  </p>
                </div>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-2xl">{group.displayName}</h3>
                      <span className="text-sm text-ink/60">{group.name}</span>
                    </div>

                    {group.members && group.members.length > 0 ? (
                      <div className="mt-4">
                        <p className="text-base text-ink/70">함께하는 식구들</p>
                        <ul className="mt-1.5 flex flex-wrap gap-1.5">
                          {group.members.map((mem) => (
                            <li key={mem} className="rounded-lg border-2 border-black/30 bg-shin-paper px-2 py-0.5 text-sm">
                              {mem}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="mt-4 rounded-xl border-2 border-black/30 bg-shin-paper px-3 py-2 text-center text-base">
                        {group.roleTitle}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImage({
                        src: group.image,
                        title: `${group.displayName} (${group.name}) 소개 카드`,
                        description: group.motto,
                      })
                    }
                    className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-black bg-white py-2 text-sm shadow-pop-sm transition-transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-shin-sky"
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                    프로필 카드 보기
                  </button>
                </div>
              </article>
            ))}

            <div className="flex flex-col justify-between rounded-3xl border-3 border-black bg-shin-yellow p-6 shadow-pop sm:col-span-2 lg:col-span-2">
              <div>
                <h3 className="text-3xl leading-tight sm:text-4xl">
                  우리 사랑방에 당신이 있어
                  <br />
                  오늘 하루가 더 빛나요!
                </h3>
                <p className="mt-3 max-w-lg text-base leading-relaxed">
                  사랑과 은혜가 넘치는 령고을에서 오래 기억에 남을 추억을 함께 만들어요.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="/join"
                  className="rounded-full border-3 border-black bg-shin-red px-6 py-3 text-lg text-white shadow-pop transition-transform hover:-translate-y-1 active:translate-y-0 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-shin-sky"
                >
                  참가자 등록하기
                </Link>
                <a
                  href="#schedule"
                  className="rounded-full border-3 border-black bg-white px-5 py-3 shadow-pop-sm hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-shin-sky"
                >
                  시간표 다시 보기
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 말씀: 구름 하늘 위 스케치북 */}
      <section className="relative overflow-hidden border-y-3 border-black bg-shin-sky px-4 py-20 md:px-[80px] sm:py-24">
        <span aria-hidden="true" className="absolute -left-10 top-8 h-20 w-56 rounded-full bg-white/80" />
        <span aria-hidden="true" className="absolute right-0 top-16 h-16 w-44 rounded-full bg-white/70" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-10 md:flex-row">
          <Character name="bo" label="꽃을 든 맹구" className="h-56 w-44 shrink-0 sm:h-64 sm:w-52" />

          <div className="relative -rotate-1 rounded-3xl border-3 border-black bg-white px-6 pb-7 pt-10 shadow-pop-lg sm:px-9">
            <span aria-hidden="true" className="spiral absolute inset-x-4 top-2 h-5" />
            <p className="text-lg text-shin-red">{event.bibleVerse}</p>
            <h2 className="mt-1 text-3xl leading-tight sm:text-5xl">너희 빛이 사람 앞에 비치게 하여</h2>
            <blockquote className="mt-4 text-base leading-relaxed text-ink/85 sm:text-lg">
              &ldquo;{event.themeVerseContent}&rdquo;
            </blockquote>
            <p className="mt-4 font-hand text-lg text-ink/70">령고을의 모든 순간이 세상 속 작은 빛으로 피어나길 소망해요.</p>
          </div>
        </div>
      </section>

      {/* 7. 공식 포스터 */}
      <section className="px-4 py-20 md:px-[80px] sm:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <TapeTitle>공식 포스터</TapeTitle>
          <p className="mt-6 text-base text-ink/80 sm:text-lg">행사 안내와 시간표가 담긴 포스터예요.</p>

          <div className="mt-6 flex justify-center gap-3">
            {[
              { id: "vertical" as const, label: "메인 포스터" },
              { id: "wide" as const, label: "종합 안내" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-pressed={posterTab === tab.id}
                onClick={() => setPosterTab(tab.id)}
                className={`rounded-full border-3 border-black px-5 py-2 shadow-pop-sm transition-transform focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-shin-sky ${
                  posterTab === tab.id ? "-translate-y-0.5 bg-shin-yellow" : "bg-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative mt-10 rotate-1 rounded-3xl border-3 border-black bg-white p-4 shadow-pop-lg sm:p-6">
            <span aria-hidden="true" className="tape absolute -top-3 left-1/2 h-5 w-24 -translate-x-1/2 -rotate-3" />
            <div className="flex flex-col items-center">
              {posterTab === "vertical" ? (
                <Image
                  src="/images/event/invitation-poster.png"
                  alt="못말리는 령고을 메인 초대장 포스터"
                  width={401}
                  height={920}
                  className="h-auto max-h-[750px] w-auto rounded-xl border-2 border-black/20"
                />
              ) : (
                <Image
                  src="/images/event/invitation-wide.png"
                  alt="못말리는 령고을 종합 안내 포스터"
                  width={3024}
                  height={4032}
                  className="h-auto max-h-[650px] w-full rounded-xl border-2 border-black/20 object-contain"
                />
              )}
              <button
                type="button"
                onClick={() =>
                  setSelectedImage(
                    posterTab === "vertical"
                      ? { src: "/images/event/invitation-poster.png", title: "못말리는 령고을 행사 포스터 원본" }
                      : { src: "/images/event/invitation-wide.png", title: "못말리는 령고을 종합 안내 원본" }
                  )
                }
                className="mt-4 inline-flex items-center gap-1.5 rounded-full border-3 border-black bg-shin-yellow px-5 py-2 shadow-pop-sm hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-shin-sky"
              >
                <ExternalLink className="h-4 w-4" />
                크게 보기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. 푸터: 잔디 */}
      <footer className="border-t-3 border-black bg-shin-grass px-4 py-14 md:px-[80px]">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-8 border-b-2 border-dashed border-black/40 pb-10 md:flex-row">
            <div className="text-center md:text-left">
              <p className="font-hand text-xl">{event.shortDate}</p>
              <h2 className="letter-stroke mt-1 text-5xl text-white sm:text-6xl">우리, 곧 만나요!</h2>
              <p className="mt-3 text-base">{event.church} {event.ministry}</p>
            </div>
            <Link
              href="/join"
              className="flex items-center gap-2 rounded-full border-3 border-black bg-shin-yellow px-7 py-4 text-xl shadow-pop transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              실시간 참여하기
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-sm">
            <p>© 2026 못말리는 령고을</p>
            <nav aria-label="바로가기" className="flex items-center gap-6">
              <Link href="/presentation" className="underline-offset-4 hover:underline">프레젠테이션 스크린</Link>
              <Link href="/admin" className="underline-offset-4 hover:underline">진행자 콘솔</Link>
              <Link href="/live" className="underline-offset-4 hover:underline">참가자 라이브 화면</Link>
            </nav>
          </div>
        </div>
      </footer>

      {/* 이미지 라이트박스 모달 */}
      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-3xl overflow-y-auto rounded-3xl border-4 border-black bg-shin-paper p-5 shadow-pop-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="닫기"
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border-3 border-black bg-shin-red text-white shadow-pop-sm hover:scale-105 active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="pr-12 text-xl sm:text-2xl">{selectedImage.title}</h3>
            {selectedImage.description && <p className="mt-1 text-sm text-ink/70">{selectedImage.description}</p>}
            <div className="mt-4 flex justify-center">
              <Image
                src={selectedImage.src}
                alt={selectedImage.title}
                width={1200}
                height={1600}
                className="h-auto max-h-[70vh] w-auto rounded-2xl border-2 border-black/20 object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
