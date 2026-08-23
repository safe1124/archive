import Link from "next/link";
import { categories } from "@/lib/products";

export function Footer({ breadcrumb }: { breadcrumb?: { label: string; href?: string }[] }) {
  return (
    <footer className="bg-[#f5f5f7] text-[12px] leading-[1.33337] text-[#6e6e73]">
      <div className="wrap py-12">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="현재 위치" className="mb-4 flex flex-wrap items-center gap-1.5 border-b border-[#d2d2d7] pb-4">
            {breadcrumb.map((crumb, index) => (
              <span key={crumb.label} className="flex items-center gap-1.5">
                {index > 0 && <span aria-hidden="true">›</span>}
                {crumb.href ? <Link href={crumb.href} className="hover:underline">{crumb.label}</Link> : <span className="text-[#1d1d1f]">{crumb.label}</span>}
              </span>
            ))}
          </nav>
        )}

        <div className="space-y-3 border-b border-[#d2d2d7] pb-6">
          <p>
            사양과 가격은 제조사와 공식 수입사가 공개한 자료를 기준으로 정리했습니다. 유통 시기나 생산 로트에 따라 실제 제품과 다를 수 있으니
            구매 전에 판매처에서 한 번 더 확인해 주세요.
          </p>
          <p>가격이 표시되지 않은 제품은 국내 정식 유통가가 확인되지 않은 경우입니다.</p>
        </div>

        <div className="grid gap-8 border-b border-[#d2d2d7] py-8 sm:grid-cols-2 lg:grid-cols-4">
          <FooterColumn title="기구 둘러보기" links={categories.filter((label) => label !== "전체").slice(0, 4).map((label) => ({ label, href: `/?category=${encodeURIComponent(label)}` }))} />
          <FooterColumn title="더 보기" links={categories.filter((label) => label !== "전체").slice(4).map((label) => ({ label, href: `/?category=${encodeURIComponent(label)}` }))} />
          <FooterColumn title="고르는 데 도움" links={[{ label: "제품 비교하기", href: "/compare" }, { label: "전체 목록 보기", href: "/" }]} />
          <div>
            <h3 className="mb-3 text-[#1d1d1f]">아카이브 정보</h3>
            <p>
              커피 기구를 고를 때마다 흩어진 사양을 다시 찾아보는 게 번거로워서 만들었습니다. 빠진 제품이나 잘못된 값이 보이면 알려주세요.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright © {new Date().getFullYear()} Coffee Archive. 개인이 운영하는 비상업 자료 모음입니다.</p>
          <p>대한민국</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="mb-3 text-[#1d1d1f]">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="hover:underline">{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
