import { scheduleList } from "@/data/schedule";

/**
 * 시간표 보드 컴포넌트
 * - presentation: 프레젠테이션 슬라이드 전용 간결 뷰
 * - 일반 웹뷰: 풍성한 서브타이틀과 활동 설명이 담긴 인터랙티브 타임라인 카드
 */
export function ScheduleBoard({
  activeTitle,
  presentation = false,
}: {
  activeTitle?: string;
  presentation?: boolean;
}) {
  if (presentation) {
    return (
      <ol className="w-full">
        {scheduleList.map((item, index) => {
          const isActive = activeTitle === item.title;
          return (
            <li
              key={item.id}
              className={`grid grid-cols-[8%_32%_1fr] items-center gap-[1cqw] border-b border-current/15 py-[0.95cqw] text-[1.35cqw] transition-colors last:border-b-0 ${
                isActive ? "bg-yellow font-black text-ink rounded-lg px-2" : ""
              }`}
            >
              <span className="text-[1.1cqw] font-bold opacity-50">
                {String(index + 1).padStart(2, "0")}
              </span>
              <time className="whitespace-nowrap font-mono font-bold tabular-nums">
                {item.timeRange}
              </time>
              <div className="flex items-center gap-2">
                <span className="font-black">{item.title}</span>
                {isActive && (
                  <span className="rounded-full bg-crayon-red px-2 py-0.5 text-[0.85cqw] font-black text-white">
                    ON AIR
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {scheduleList.map((item, index) => {
        const isActive = activeTitle === item.title;
        return (
          <div
            key={item.id}
            className={`group relative overflow-hidden rounded-2xl border-2 border-ink bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-pop-sm sm:p-4 ${
              isActive
                ? "border-crayon-red bg-[#fffdf0] shadow-pop ring-2 ring-crayon-red/30"
                : "shadow-pop-sm"
            }`}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink bg-paper text-xs font-black text-ink">
                  {index + 1}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-lg font-black text-ink sm:text-xl">
                    {item.title}
                  </h4>
                  {isActive && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-crayon-red px-2.5 py-0.5 text-xs font-black text-white animate-pulse">
                      진행 중
                    </span>
                  )}
                </div>
              </div>

              <div className="self-start sm:self-auto">
                <span className="inline-flex items-center rounded-full border border-ink/40 bg-crayon-yellow/30 px-3 py-1 text-xs font-black text-ink">
                  ⏰ {item.timeRange}
                </span>
              </div>
            </div>

            {item.subTitle && (
              <p className="mt-2 text-xs font-bold text-neutral-600 sm:text-sm">
                💡 {item.subTitle}
              </p>
            )}

            <p className="mt-1 line-clamp-1 hidden text-xs text-neutral-500">
              {item.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
