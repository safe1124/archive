import type { Metadata } from "next";
import { CompareView } from "@/components/compare-view";

export const metadata: Metadata = {
  title: "비교하기",
  description: "같은 종류의 커피 기구를 최대 4개까지 나란히 놓고 사양을 비교해 보세요.",
};

export default function ComparePage() {
  return <CompareView />;
}
