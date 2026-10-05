import Link from "next/link";
import { event } from "@/data/event";

/**
 * 사이트 종료 안내 페이지
 * 로그인하지 않은 방문자가 어떤 페이지를 열어도 이 화면으로 오게 된다
 */
export default function ClosedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-crayon-bg px-4">
      <section className="w-full max-w-md rounded-3xl border-3 border-black bg-white p-8 text-center shadow-pop-lg">
        <div className="text-6xl">🎉</div>
        <h1 className="mt-4 text-3xl font-black">행사가 종료되었어요</h1>
        <p className="mt-3 text-base font-bold text-neutral-700">
          {event.title} 행사에 함께해 주셔서 감사합니다.
        </p>
        <p className="mt-1 text-sm text-neutral-500">이 사이트는 현재 비공개로 운영 중이에요.</p>
        <Link
          href="/admin/login?next=/"
          className="mt-6 inline-block text-xs font-bold text-neutral-400 underline underline-offset-4"
        >
          진행자 로그인
        </Link>
      </section>
    </main>
  );
}
