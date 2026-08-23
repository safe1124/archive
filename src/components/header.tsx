"use client";

import Link from "next/link";
import { categories } from "@/lib/products";
import { useCompareBox } from "@/hooks/use-compare-box";

const navLinks = [
  { label: "스토어", href: "/" },
  ...categories.filter((label) => label !== "전체").map((label) => ({ label, href: `/?category=${encodeURIComponent(label)}` })),
  { label: "비교하기", href: "/compare" },
];

export function Header() {
  const { ids } = useCompareBox();

  // <details>는 React 수화 전에도 브라우저가 직접 열고 닫습니다.
  // 모바일 네트워크에서 JS가 늦게 붙어도 메뉴가 즉시 동작하도록 사용합니다.
  function closeMobileMenu() {
    document.getElementById("mobile-primary-menu")?.removeAttribute("open");
  }

  return (
    <header className="sticky top-0 z-50 bg-[rgba(22,22,23,.8)] backdrop-blur-[20px] backdrop-saturate-[180%]">
      <nav aria-label="주요 메뉴" className="wrap relative">
        <div className="relative flex h-11 items-center justify-between">
          <details id="mobile-primary-menu" className="-ml-3 shrink-0 lg:hidden">
            <summary aria-label="메뉴" className="relative z-30 flex h-11 w-11 cursor-pointer list-none touch-manipulation flex-col items-center justify-center gap-[5px] [&::-webkit-details-marker]:hidden">
              <span className="block h-px w-4 bg-[#f5f5f7]" />
              <span className="block h-px w-4 bg-[#f5f5f7]" />
            </summary>
            <ul className="absolute inset-x-0 top-11 z-20 border-t border-white/10 bg-[#161617]/[.98] px-6 pb-4 shadow-2xl">
              {navLinks.map((item) => (
                <li key={item.label} className="border-b border-white/10 last:border-0">
                  <Link href={item.href} onClick={closeMobileMenu} className="block py-3 text-[17px] font-medium text-[#f5f5f7]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>

          <Link href="/" onClick={closeMobileMenu} aria-label="Coffee Archive 홈" className="flex items-center gap-1.5 text-[#f5f5f7]">
            <BeanMark />
            <span className="text-[13px] font-medium tracking-tight">Coffee Archive</span>
          </Link>

          <ul className="hidden flex-1 items-center justify-evenly px-8 lg:flex">
            {navLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} onClick={closeMobileMenu} className="text-[12px] leading-[44px] text-[#f5f5f7]/80 transition-colors hover:text-[#f5f5f7]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link href="/compare" onClick={closeMobileMenu} aria-label={`비교하기, 비교함 ${ids.length}개 담김`} className="relative z-10 -mr-1 flex h-11 shrink-0 touch-manipulation items-center justify-end gap-1.5 px-1 text-[#f5f5f7]/80 transition-colors hover:text-[#f5f5f7]">
            <span className="text-[12px] font-medium lg:hidden">비교</span>
            <BagMark />
            {ids.length > 0 && (
              <span className="absolute -top-0.5 right-[-6px] grid h-[15px] min-w-[15px] place-items-center rounded-full bg-[#0071e3] px-1 text-[10px] font-medium text-white">
                {ids.length}
              </span>
            )}
          </Link>
        </div>

      </nav>
    </header>
  );
}

function BeanMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2zm0 2c-1.4 1.9-2.1 4.1-2.1 6.4 0 3.1 1.3 6 3.6 8.1a8 8 0 0 0 3.3-2c-1.9-1.7-3-4.1-3-6.7 0-2 .7-3.9 1.9-5.5A8 8 0 0 0 12 4z" />
    </svg>
  );
}

function BagMark() {
  return (
    <svg width="15" height="18" viewBox="0 0 15 18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.1">
      <path d="M1 5.5h13l-.9 11.2a.8.8 0 0 1-.8.8H2.7a.8.8 0 0 1-.8-.8z" />
      <path d="M4.9 5.5V4a2.6 2.6 0 1 1 5.2 0v1.5" />
    </svg>
  );
}
