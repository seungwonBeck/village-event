import type { ReactNode } from "react";
import type { CharacterKey } from "@/data/groups";

export const characterPngs: Record<CharacterKey, string> = {
  shiro: "/characters/shiro.png?v=4",
  himawari: "/characters/himawari.png?v=3",
  nene: "/characters/yuri.png?v=3",
  bo: "/characters/maenggu.png?v=3",
  kazama: "/characters/cheolsu.png?v=3",
  hero: "/characters/hero.png?v=3",
  masao: "/characters/hooni.png?v=4",
  shinchan: "/characters/shinchan.png?v=3",
};

/**
 * 고해상도 투명 누끼 캐릭터 렌더링 컴포넌트
 * - transparent(기본): 배경 없는 누끼 상태로 카드 위로 톡 튀어나오는 생동감 있는 연출
 * - framed: 배경 카드/원형 프레임 안에 쏙 들어가는 깔끔한 연출
 */
export function Character({
  name,
  className = "",
  label,
  variant = "transparent",
}: {
  name: CharacterKey;
  className?: string;
  label?: string;
  variant?: "transparent" | "framed";
}) {
  const imgSrc = characterPngs[name] || `/characters/${name}.png`;

  if (variant === "framed") {
    return (
      <div
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        className={`relative aspect-[3/4] shrink-0 overflow-hidden rounded-[42%] border-2 border-ink bg-white shadow-pop-sm ${className}`}
      >
        <img
          src={imgSrc}
          alt={label || ""}
          draggable={false}
          className="h-full w-full select-none object-contain p-2 transition-transform duration-300 hover:scale-110"
        />
      </div>
    );
  }

  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      <img
        src={imgSrc}
        alt={label || ""}
        draggable={false}
        className="h-full w-full select-none object-contain drop-shadow-[0_0_2px_rgba(255,255,255,0.9)] transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
}
export function EventLogo({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return <span aria-label="못말리는 령고을" className={`inline-flex font-black leading-[1.1] tracking-[-.06em] ${compact ? "items-baseline gap-[.2em]" : "flex-col items-center"} ${className}`}>
    <span aria-hidden="true" className={compact?"font-hand":"text-[.8em]"}>못말리는</span>
    <span aria-hidden="true">령고을<span className="text-green">.</span></span>
  </span>;
}
export function Courtyard({ className = "" }: { className?: string }) {
  return <img src="/images/event/courtyard.png" alt="" aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full object-cover ${className}`} />;
}
export function Doodles({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
    <span className="absolute left-[6%] top-[14%] -rotate-12 text-[1.8em] text-[#66c6e9]">✦</span>
    <span className="absolute right-[7%] top-[12%] rotate-12 text-[1.5em] text-[#f4af58]">✦</span>
    <span className="absolute right-[10%] bottom-[12%] -rotate-12 text-[1.8em] text-[#f779a7]">♡</span>
  </div>;
}
export function Paper({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`paper-grain rounded-2xl border border-ink shadow-[4px_4px_0_#191919] ${className}`}>{children}</div>;
}
export function Icon({ name, className = "" }: { name: "calendar" | "clock" | "pin" | "book" | "home" | "vote" | "question" | "heart" | "trophy" | "screen"; className?: string }) {
  const paths = {
    calendar: <><path d="M8 3v4m8-4v4M4 10h16"/><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 14h2m4 0h2m-8 4h2"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 3"/></>,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    book: <><path d="M12 5v15M3 4c4-1 7 0 9 2 2-2 5-3 9-2v15c-4-1-7 0-9 2-2-2-5-3-9-2Z"/></>,
    home: <><path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8"/></>,
    vote: <><rect x="4" y="3" width="16" height="18" rx="3"/><path d="m8 9 2 2 5-5m-7 9h8m-8 3h5"/></>,
    question: <><path d="M21 11a9 9 0 0 1-9 9H4l-1 2v-9a9 9 0 1 1 18-2Z"/><path d="M9.5 8a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4m0 3v.1"/></>,
    heart: <path d="M20 5c-3-3-6 0-8 2-2-2-5-5-8-2-5 5 4 12 8 15 4-3 13-10 8-15Z"/>,
    trophy: <><path d="M8 3h8v8a4 4 0 0 1-8 0ZM8 5H3v3c0 3 2 4 5 4m8-7h5v3c0 3-2 4-5 4m-4 3v5m-5 1h10"/></>,
    screen: <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M12 17v4m-5 0h10"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`h-6 w-6 shrink-0 ${className}`}>{paths[name]}</svg>;
}
