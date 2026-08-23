import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductArt } from "@/components/product-art";
import { ProductCompareButton } from "@/components/product-compare-button";
import { formatPrice, getComparableSpecs, getProduct, getProductImage, products } from "@/lib/products";
import { knownSpecs } from "@/lib/spec-display";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return {};
  return { title: `${product.brand} ${product.name}`, description: product.summary };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const productImage = getProductImage(product);
  const specs = knownSpecs(getComparableSpecs(product));
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);

  return (
    <div>
      <Header />

      <div className="sticky top-11 z-40 border-b border-[#d2d2d7] bg-[rgba(255,255,255,.92)] backdrop-blur-[20px]">
        <div className="wrap flex h-[52px] items-center justify-between gap-4">
          <p className="truncate text-[19px] font-semibold tracking-tight">{product.name}</p>
          <div className="flex items-center gap-5">
            <a href="#specs" className="hidden text-[12px] text-[#1d1d1f] hover:text-[#6e6e73] sm:block">
              사양
            </a>
            <a href="#notes" className="hidden text-[12px] text-[#1d1d1f] hover:text-[#6e6e73] sm:block">
              사용 특징
            </a>
            <ProductCompareButton id={product.id} className="btn btn-blue btn-sm" />
          </div>
        </div>
      </div>

      <main>
        <section className="wrap grid gap-8 py-8 sm:py-12 lg:grid-cols-2 lg:gap-16 lg:py-16">
          <div className="grid place-items-center rounded-[18px] bg-white py-6 sm:py-12">
            <ProductArt product={product} className="h-56 w-56 sm:h-72 sm:w-72" />
            {productImage && <a href={productImage.source} target="_blank" rel="noreferrer" className="mt-5 text-[11px] text-[#6e6e73] underline underline-offset-2 hover:text-[#1d1d1f]">제품 이미지 출처 ↗</a>}
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#bf4800]">{product.brand}</p>
            <h1 className="headline mt-2">{product.name}</h1>
            <p className="mt-2 text-[17px] text-[#6e6e73]">{product.nameEn}</p>
            <p className="mt-6 text-[17px] leading-relaxed">{product.summary}</p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <li key={tag} className="rounded-[980px] bg-[#f5f5f7] px-3 py-1.5 text-[12px] text-[#6e6e73]">
                  {tag}
                </li>
              ))}
            </ul>

            <p className="mt-8 text-[28px] font-semibold tracking-tight">{formatPrice(product.price)}</p>
            <p className="mt-1 text-[12px] text-[#6e6e73]">
              {product.year}년 출시 · {product.difficulty}
              {product.reviews > 0 && ` · 별점 ${product.rating} (리뷰 ${product.reviews})`}
            </p>

            <ProductCompareButton id={product.id} className="btn btn-blue mt-7 w-full sm:w-auto sm:self-start" />
            <p className="mt-3 text-[12px] text-[#6e6e73]">같은 종류끼리 최대 4개까지 나란히 볼 수 있습니다.</p>
          </div>
        </section>

        <section id="specs" className="border-t border-[#d2d2d7] py-14">
          <div className="wrap">
            <h2 className="subhead mb-8">사양</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-12">
              {specs.map(([key, value]) => (
                <div key={key} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-4 border-b border-[#e8e8ed] py-3.5">
                  <dt className="text-[14px] text-[#6e6e73]">{key}</dt>
                  <dd className="text-[14px]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="notes" className="bg-[#f5f5f7] py-14">
          <div className="wrap">
            <h2 className="subhead mb-8">써 보면 이런 점</h2>
            <div className="grid gap-10 sm:grid-cols-2">
              <NoteList title="좋은 점" items={product.pros} />
              <NoteList title="감안할 점" items={product.cons} />
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="wrap">
            <h2 className="subhead mb-2">함께 쓰기 좋은 규격</h2>
            <p className="mb-8 text-[14px] text-[#6e6e73]">제조사가 안내한 호환 규격입니다.</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {product.compatible.map((name) => (
                <li key={name} className="rounded-[18px] bg-[#f5f5f7] px-6 py-5 text-[17px]">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {related.length > 0 && (
          <section className="border-t border-[#d2d2d7] py-14">
            <div className="wrap">
              <h2 className="subhead mb-8">같은 {product.category} 더 보기</h2>
              <ul className="grid grid-cols-2 gap-5 lg:grid-cols-4">
                {related.map((item) => (
                  <li key={item.id} className="rounded-[18px] bg-[#f5f5f7] p-5 text-center">
                    <Link href={`/products/${item.id}`}>
                      <span className="grid h-28 place-items-center rounded-[12px] bg-white">
                        <ProductArt product={item} className="h-24 w-24" />
                      </span>
                      <p className="mt-3 text-[12px] font-semibold text-[#6e6e73]">{item.brand}</p>
                      <p className="mt-1 text-[14px] font-semibold">{item.name}</p>
                      <p className="mt-1 text-[12px] text-[#6e6e73]">{formatPrice(item.price)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>

      <Footer
        breadcrumb={[
          { label: "Coffee Archive", href: "/" },
          { label: product.category, href: `/?category=${encodeURIComponent(product.category)}` },
          { label: product.name },
        ]}
      />
    </div>
  );
}

function NoteList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-4 text-[17px] font-semibold">{title}</h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="border-t border-[#d2d2d7] pt-3 text-[14px] leading-relaxed text-[#1d1d1f] first:border-0 first:pt-0">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
