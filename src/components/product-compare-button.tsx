"use client";

import { useRouter } from "next/navigation";
import { useCompareBox } from "@/hooks/use-compare-box";
import { products } from "@/lib/products";

export function ProductCompareButton({ id, className = "btn btn-blue" }: { id: string; className?: string }) {
  const router = useRouter();
  const { ids, toggle } = useCompareBox();
  const inBox = ids.includes(id);
  const category = products.find((product) => product.id === id)?.category;
  const boxCategory = products.find((product) => product.id === ids[0])?.category;
  const blocked = !inBox && ((boxCategory !== undefined && boxCategory !== category) || ids.length >= 4);

  function handleClick() {
    if (!inBox && !blocked) toggle(id);
    router.push("/compare");
  }

  return (
    <button type="button" onClick={handleClick} disabled={blocked} className={className} title={blocked ? "같은 종류끼리 최대 4개까지 담을 수 있습니다." : undefined}>
      {inBox ? "비교함에서 보기" : "비교함에 담기"}
    </button>
  );
}
