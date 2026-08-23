"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductArt } from "@/components/product-art";
import { categories, categorySpecOrder, formatPrice, getComparableSpecs, products } from "@/lib/products";
import { useCompareBox } from "@/hooks/use-compare-box";

const MAX = 4;

export function CompareView() {
  const { ids, save, toggle } = useCompareBox();
  const [diffOnly, setDiffOnly] = useState(false);

  const selected = useMemo(() => ids.map((id) => products.find((p) => p.id === id)).filter((p): p is (typeof products)[number] => Boolean(p)), [ids]);
  const locked = selected[0]?.category;

  // 다른 종류가 섞이면 비교할 사양 자체가 달라지므로 첫 번째 종류만 남깁니다.
  useEffect(() => {
    if (!locked) return;
    const sameCategory = selected.filter((product) => product.category === locked).map((product) => product.id);
    if (sameCategory.length !== ids.length) save(sameCategory);
  }, [ids.length, save, selected, locked]);

  const specs = useMemo(() => selected.map(getComparableSpecs), [selected]);
  const keys = useMemo(
    () => (locked ? categorySpecOrder[locked].filter((key) => specs.some((row) => Boolean(row[key]))) : []),
    [locked, specs],
  );
  const visibleKeys = diffOnly
    ? keys.filter((key) => new Set(specs.map((row) => row[key] || "확인 필요")).size > 1)
    : keys;

  const addable = products.filter((product) => !ids.includes(product.id) && (!locked || product.category === locked));
  // 고른 개수와 상관없이 칸 너비를 고정해야 열이 늘어지지 않습니다.
  const slots = Math.min(Math.max(selected.length + 1, 2), MAX);
  // 1fr로 두면 제품이 2개일 때 칸이 지나치게 넓어집니다. 위쪽 폭을 묶어 둡니다.
  const columns = `128px repeat(${slots}, minmax(190px, 264px))`;
  const minWidth = 128 + slots * 210;

  return (
    <div>
      <Header />

      <main>
        <section className="wrap pt-12 pb-8">
          <h1 className="headline">
            비교하기. <span className="text-[#6e6e73]">고민되는 것들을 나란히 놓고 보세요.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[17px] text-[#6e6e73]">
            같은 종류의 기구를 최대 {MAX}개까지 고를 수 있습니다. 사양이 서로 다른 항목만 보고 싶다면 아래에서 켜 두세요.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <label className="flex cursor-pointer items-center gap-2 text-[14px]">
              <input type="checkbox" checked={diffOnly} onChange={(event) => setDiffOnly(event.target.checked)} className="h-4 w-4 accent-[#0071e3]" />
              차이 나는 항목만 보기
            </label>
            {selected.length > 0 && (
              <button type="button" onClick={() => save([])} className="link-blue text-[14px]">
                모두 지우기
              </button>
            )}
            <Link href="/" className="link-blue text-[14px]">
              스토어에서 더 찾아보기 ›
            </Link>
          </div>
        </section>

        <section className="wrap rule pt-8 pb-20">
          <div className="overflow-x-auto pb-2">
            <div style={{ minWidth }}>
              <div className="grid border-b border-[#e8e8ed] pb-8" style={{ gridTemplateColumns: columns }}>
                <p className="pt-1 text-[12px] text-[#6e6e73]">
                  {selected.length}/{MAX} 선택
                </p>

                {selected.map((product) => (
                  <div key={product.id} className="px-3 text-center">
                    <div className="grid place-items-center rounded-[18px] bg-white py-6">
                      <ProductArt product={product} className="h-28 w-28" />
                    </div>
                    <p className="mt-4 text-[12px] font-semibold text-[#6e6e73]">{product.brand}</p>
                    <Link href={`/products/${product.id}`} className="mt-1 block text-[17px] font-semibold leading-snug hover:underline">
                      {product.name}
                    </Link>
                    <p className="mt-2 text-[14px]">{formatPrice(product.price)}</p>
                    <button type="button" onClick={() => toggle(product.id)} className="link-blue mt-3 text-[12px]">
                      빼기
                    </button>
                  </div>
                ))}

                {selected.length < MAX && (
                  <div key="add" className="px-3 text-center">
                    <div className="grid place-items-center rounded-[18px] border border-dashed border-[#d2d2d7] py-6" style={{ minHeight: 148 }}>
                      <span className="text-[34px] leading-none font-light text-[#86868b]">+</span>
                    </div>
                    <label className="mt-4 block text-[12px] text-[#6e6e73]">제품 추가</label>
                    <select
                      value=""
                      onChange={(event) => event.target.value && toggle(event.target.value)}
                      className="mt-2 h-9 w-full rounded-lg border border-[#d2d2d7] bg-white px-2 text-[14px]"
                    >
                      <option value="">선택하세요</option>
                      {locked
                        ? addable.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.brand} {product.name}
                            </option>
                          ))
                        : categories
                            .filter((label) => label !== "전체")
                            .map((label) => (
                              <optgroup key={label} label={label}>
                                {addable
                                  .filter((product) => product.category === label)
                                  .map((product) => (
                                    <option key={product.id} value={product.id}>
                                      {product.brand} {product.name}
                                    </option>
                                  ))}
                              </optgroup>
                            ))}
                    </select>
                  </div>
                )}

                {Array.from({ length: Math.max(slots - selected.length - 1, 0) }, (_, index) => (
                  <div key={`empty-${index}`} aria-hidden="true" />
                ))}
              </div>

              {selected.length < 2 ? (
                <p className="py-24 text-center text-[17px] text-[#6e6e73]">
                  비교할 제품을 두 개 이상 골라 주세요.
                  {locked && ` 지금은 ${locked}끼리만 담을 수 있습니다.`}
                </p>
              ) : (
                <>
                  <h2 className="subhead pt-12 pb-6">사양</h2>
                  <dl>
                    {visibleKeys.map((key) => (
                      <div key={key} className="grid border-b border-[#e8e8ed]" style={{ gridTemplateColumns: columns }}>
                        <dt className="py-4 pr-4 text-[12px] text-[#6e6e73]">{key}</dt>
                        {specs.map((row, index) => (
                          <dd key={`${key}-${index}`} className="px-3 py-4 text-[14px] leading-snug">
                            {row[key] || "확인 필요"}
                          </dd>
                        ))}
                      </div>
                    ))}
                  </dl>
                  {visibleKeys.length === 0 && (
                    <p className="py-16 text-center text-[17px] text-[#6e6e73]">고른 제품들의 사양이 모두 같습니다.</p>
                  )}

                  <h2 className="subhead pt-14 pb-6">써 보면 이런 점</h2>
                  <div className="grid" style={{ gridTemplateColumns: columns }}>
                    <p className="pt-1 pr-4 text-[12px] text-[#6e6e73]">좋은 점</p>
                    {selected.map((product) => (
                      <ul key={product.id} className="space-y-2.5 px-3">
                        {product.pros.map((item) => (
                          <li key={item} className="text-[14px] leading-snug">
                            {item}
                          </li>
                        ))}
                      </ul>
                    ))}
                  </div>
                  <div className="mt-10 grid border-t border-[#d2d2d7] pt-8" style={{ gridTemplateColumns: columns }}>
                    <p className="pt-1 pr-4 text-[12px] text-[#6e6e73]">감안할 점</p>
                    {selected.map((product) => (
                      <ul key={product.id} className="space-y-2.5 px-3">
                        {product.cons.map((item) => (
                          <li key={item} className="text-[14px] leading-snug text-[#6e6e73]">
                            {item}
                          </li>
                        ))}
                      </ul>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer breadcrumb={[{ label: "Coffee Archive", href: "/" }, { label: "비교하기" }]} />
    </div>
  );
}
