"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductArt } from "@/components/product-art";
import { categories, formatPrice, products, type Category } from "@/lib/products";
import { useCompareBox } from "@/hooks/use-compare-box";
import { knownOptions } from "@/lib/spec-display";

type Sort = "인기순" | "낮은 가격순" | "최신순";

const ALL = "전체";

export function ArchiveBrowser() {
  const router = useRouter();
  const params = useSearchParams();
  const fromUrl = params.get("category");
  const category: "전체" | Category = categories.includes(fromUrl as Category) ? (fromUrl as Category) : ALL;

  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState(ALL);
  const [material, setMaterial] = useState(ALL);
  const [difficulty, setDifficulty] = useState(ALL);
  const [sort, setSort] = useState<Sort>("인기순");
  const [notice, setNotice] = useState("");
  const { ids: compare, toggle, save } = useCompareBox();

  const inCategory = useMemo(() => products.filter((p) => category === ALL || p.category === category), [category]);
  const brands = useMemo(() => [...new Set(inCategory.map((p) => p.brand))].sort(), [inCategory]);
  const materials = useMemo(() => knownOptions([...new Set(inCategory.map((p) => p.material))]).sort(), [inCategory]);

  const filtered = useMemo(() => {
    const words = query.toLowerCase().replaceAll(" ", "");
    const result = inCategory.filter(
      (p) =>
        (brand === ALL || p.brand === brand) &&
        (material === ALL || p.material === material) &&
        (difficulty === ALL || p.difficulty === difficulty) &&
        `${p.brand} ${p.name} ${p.nameEn} ${p.tags.join(" ")}`.toLowerCase().replaceAll(" ", "").includes(words),
    );
    return result.toSorted((a, b) =>
      sort === "낮은 가격순" ? (a.price || Infinity) - (b.price || Infinity) : sort === "최신순" ? b.year - a.year : b.reviews - a.reviews,
    );
  }, [inCategory, brand, material, difficulty, query, sort]);

  const picked = compare.map((id) => products.find((p) => p.id === id)).filter((p): p is (typeof products)[number] => Boolean(p));
  const filtersOn = brand !== ALL || material !== ALL || difficulty !== ALL || query !== "";

  function setCategory(next: "전체" | Category) {
    // 카테고리를 옮기면 이전 카테고리에만 있던 브랜드·재질이 남아 결과가 0개가 될 수 있습니다.
    setBrand(ALL);
    setMaterial(ALL);
    router.replace(next === ALL ? "/" : `/?category=${encodeURIComponent(next)}`, { scroll: false });
  }

  function say(message: string) {
    setNotice(message);
    setTimeout(() => setNotice(""), 2400);
  }

  function toggleCompare(id: string) {
    const candidate = products.find((p) => p.id === id);
    const pickedCategory = picked[0]?.category;
    if (!candidate || compare.includes(id)) return toggle(id);
    if (pickedCategory && candidate.category !== pickedCategory) return say(`비교함에는 ${pickedCategory}끼리만 담을 수 있습니다.`);
    if (compare.length >= 4) return say("비교함에는 최대 4개까지 담을 수 있습니다.");
    toggle(id);
  }

  function resetFilters() {
    setQuery("");
    setBrand(ALL);
    setMaterial(ALL);
    setDifficulty(ALL);
  }

  const filterPanel = (
    <>
      <FilterGroup label="브랜드" options={brands} value={brand} onChange={setBrand} />
      <FilterGroup label="재질" options={materials} value={material} onChange={setMaterial} />
      <FilterGroup label="사용 난이도" options={["입문자용", "숙련자용"]} value={difficulty} onChange={setDifficulty} />
    </>
  );

  return (
    <div className={picked.length > 0 ? "pb-24" : undefined}>
      <Header />

      <main>
        <section className="wrap pt-10 pb-9 sm:pt-14">
          <h1 className="headline max-w-[19ch] text-balance">
            Store. <span className="text-[#6e6e73]">커피 기구를 고르는 가장 좋은 방법.</span>
          </h1>
          <p className="wrap-text mt-4 text-[17px] text-[#6e6e73]">
            드리퍼 하나를 고르는 데도 반나절이 걸리곤 합니다. 사양을 한자리에 모아 두었으니, 마음에 드는 것들을 골라 나란히 놓고 보세요.
          </p>
        </section>

        <section aria-label="종류별로 보기" className="pb-10">
          <div className="wrap">
            <ul className="hide-scrollbar -mx-2 flex gap-2 overflow-x-auto px-2 pb-2 sm:gap-4">
              {categories.map((label) => {
                const sample = label === ALL ? products[0] : products.find((p) => p.category === label);
                const active = category === label;
                return (
                  <li key={label}>
                    <button
                      type="button"
                      onClick={() => setCategory(label)}
                      aria-pressed={active}
                      className="flex w-[76px] flex-col items-center gap-2 rounded-xl py-1 text-center"
                    >
                      <span className={`grid h-16 w-16 place-items-center overflow-hidden rounded-full border transition-colors ${active ? "border-[#1d1d1f] bg-white" : "border-transparent bg-[#f5f5f7]"}`}>
                        {sample && <ProductArt product={sample} className="h-full w-full" />}
                      </span>
                      <span className={`text-[12px] leading-tight ${active ? "font-semibold text-[#1d1d1f]" : "text-[#6e6e73]"}`}>{label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <div className="wrap rule grid grid-cols-1 gap-x-10 pt-9 pb-20 lg:grid-cols-[176px_1fr]">
          <aside className="hidden lg:block">
            <h2 className="mb-1 border-b border-[#e8e8ed] pb-3 text-[15px] font-semibold">필터</h2>
            {filterPanel}
            {filtersOn && (
              <button type="button" onClick={resetFilters} className="link-blue text-[12px]">
                필터 지우기
              </button>
            )}
          </aside>

          <section>
            <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-3">
              <h2 className="subhead mr-auto">
                {category === ALL ? "모든 커피 기구" : category}
                <span className="ml-2 align-middle text-[15px] font-normal text-[#6e6e73]">{filtered.length}</span>
              </h2>
              {/* 좁은 화면에서는 검색·정렬을 아래 한 줄로 내려 검색창이 뭉개지지 않게 합니다. */}
              <div className="flex w-full items-center gap-2 sm:w-[400px]">
                <SearchField value={query} onChange={setQuery} />
                <select
                  aria-label="정렬 기준"
                  value={sort}
                  onChange={(event) => setSort(event.target.value as Sort)}
                  className="h-9 shrink-0 rounded-lg border border-[#d2d2d7] bg-white px-3 text-[14px]"
                >
                  <option>인기순</option>
                  <option>낮은 가격순</option>
                  <option>최신순</option>
                </select>
              </div>
            </div>

            <details className="group mb-6 rounded-xl border border-[#d2d2d7] px-4 lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-[14px] font-semibold [&::-webkit-details-marker]:hidden">
                <span>
                  필터
                  {filtersOn && <span className="ml-2 font-normal text-[#06c]">적용 중</span>}
                </span>
                <Chevron />
              </summary>
              <div className="pb-2">{filterPanel}</div>
            </details>

            {filtered.length > 0 ? (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((product) => {
                  const selected = compare.includes(product.id);
                  return (
                    <li key={product.id} className="group flex flex-col rounded-[18px] bg-[#f5f5f7] p-5 text-center">
                      <Link href={`/products/${product.id}`} className="flex flex-1 flex-col">
                        <span className="grid h-36 place-items-center rounded-[12px] bg-white">
                          <ProductArt product={product} className="h-32 w-32" />
                        </span>
                        <p className="mt-4 text-[12px] text-[#6e6e73]">{product.brand}</p>
                        <h3 className="mt-1 text-[17px] font-semibold leading-snug group-hover:underline">{product.name}</h3>
                        <p className="mt-2 line-clamp-2 text-[12px] leading-[1.4] text-[#6e6e73]">{product.summary}</p>
                        <p className="mt-auto pt-4 text-[14px]">{formatPrice(product.price)}</p>
                        {product.reviews > 0 && (
                          <p className="mt-1 text-[12px] text-[#6e6e73]">
                            별점 {product.rating} · 리뷰 {product.reviews}
                          </p>
                        )}
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleCompare(product.id)}
                        aria-pressed={selected}
                        className={`btn btn-sm mt-5 self-center ${selected ? "btn-blue" : "btn-quiet"}`}
                      >
                        {selected ? "비교함에 담김" : "비교함에 담기"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="rounded-[18px] bg-[#f5f5f7] px-6 py-20 text-center">
                <p className="text-[19px] font-semibold">조건에 맞는 제품이 없습니다</p>
                <p className="mt-2 text-[14px] text-[#6e6e73]">검색어의 철자를 확인하거나 필터를 조금 넓혀 보세요.</p>
                <button type="button" onClick={resetFilters} className="link-blue mt-4 text-[14px]">
                  필터 지우기
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer breadcrumb={[{ label: "Coffee Archive", href: "/" }, { label: category === ALL ? "스토어" : category }]} />

      {picked.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#d2d2d7] bg-[rgba(255,255,255,.94)] backdrop-blur-[20px]">
          <div className="wrap flex items-center gap-4 py-3">
            <p className="hidden shrink-0 text-[12px] text-[#6e6e73] sm:block">
              비교함 {picked.length}/4 · {picked[0].category}
            </p>
            <ul className="hide-scrollbar flex flex-1 gap-2 overflow-x-auto">
              {picked.map((product) => (
                <li key={product.id} className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#f5f5f7] py-1 pr-1 pl-2">
                  <span className="max-w-32 truncate text-[12px]">{product.name}</span>
                  <button
                    type="button"
                    onClick={() => toggle(product.id)}
                    aria-label={`${product.name} 비교함에서 빼기`}
                    className="grid h-5 w-5 place-items-center rounded-full text-[#6e6e73] hover:bg-[#e8e8ed]"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => save([])} className="link-blue shrink-0 text-[12px]">
              비우기
            </button>
            <Link
              href="/compare"
              aria-disabled={picked.length < 2}
              className={`btn btn-blue btn-sm shrink-0 ${picked.length < 2 ? "pointer-events-none opacity-35" : ""}`}
            >
              비교하기
            </Link>
          </div>
        </div>
      )}

      {notice && (
        <p role="status" className="fixed left-1/2 top-16 z-50 -translate-x-1/2 rounded-xl bg-[rgba(0,0,0,.82)] px-4 py-2.5 text-[14px] text-white">
          {notice}
        </p>
      )}
    </div>
  );
}

function SearchField({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  return (
    <div className="relative min-w-0 flex-1 sm:max-w-[320px]">
      <svg viewBox="0 0 16 16" aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 fill-none stroke-[#6e6e73]" strokeWidth="1.4">
        <circle cx="7" cy="7" r="5" />
        <path d="M11 11l4 4" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="제품명, 브랜드로 검색"
        aria-label="제품 검색"
        className="h-9 w-full rounded-[980px] bg-[#f5f5f7] pr-4 pl-10 text-[14px] outline-none placeholder:text-[#86868b]"
      />
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (next: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const LIMIT = 8;
  const overflowing = options.length > LIMIT;
  // 목록을 그냥 잘라 두면 뒤에 뭐가 더 있는지 알 수 없어서, 몇 개가 남았는지 적어 둡니다.
  const shown = !overflowing || expanded ? options : [...new Set([...options.slice(0, LIMIT), ...(options.includes(value) ? [value] : [])])];

  return (
    <details open className="group border-b border-[#d2d2d7] py-4 last:border-0">
      <summary className="flex cursor-pointer list-none items-center justify-between text-[14px] font-semibold [&::-webkit-details-marker]:hidden">
        {label}
        <Chevron />
      </summary>
      <div className="mt-3 space-y-2.5">
        {[ALL, ...shown].map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-2 text-[14px] text-[#1d1d1f]">
            <input type="radio" checked={value === option} onChange={() => onChange(option)} className="h-3.5 w-3.5 accent-[#0071e3]" />
            {option}
          </label>
        ))}
      </div>
      {overflowing && (
        <button type="button" onClick={() => setExpanded(!expanded)} className="link-blue mt-3 text-[12px]">
          {expanded ? "간단히 보기" : `${options.length - LIMIT}개 더 보기`}
        </button>
      )}
    </details>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 12 8" aria-hidden="true" className="h-2 w-3 fill-none stroke-[#6e6e73] transition-transform group-open:rotate-180" strokeWidth="1.6">
      <path d="M1 1.5L6 6.5L11 1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
