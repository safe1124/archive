"use client";

import { useCallback, useEffect, useState } from "react";
import { products } from "@/lib/products";

const STORAGE_KEY = "coffee-archive-compare";
const CHANGE_EVENT = "coffee-archive-compare-change";

function normalizeIds(value: unknown): string[] {
  const rawIds = Array.isArray(value) ? value : [];
  const validIds = rawIds
    .filter((id): id is string => typeof id === "string" && products.some((product) => product.id === id))
    .filter((id, index, all) => all.indexOf(id) === index)
    .slice(0, 4);
  const category = products.find((product) => product.id === validIds[0])?.category;
  return category ? validIds.filter((id) => products.find((product) => product.id === id)?.category === category) : validIds;
}

function readIds() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return normalizeIds(value ? JSON.parse(value) : []);
  } catch { return []; }
}

export function useCompareBox() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => {
      const validIds = readIds();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(validIds));
      setIds(validIds);
    };
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(CHANGE_EVENT, sync); window.removeEventListener("storage", sync); };
  }, []);

  const save = useCallback((next: string[]) => {
    const normalized = normalizeIds(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    setIds(normalized);
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return normalized;
  }, []);

  const toggle = useCallback((id: string) => {
    // 이벤트가 연달아 와도 렌더 시점의 ids가 아닌 저장된 최신 값을 기준으로 갱신합니다.
    const current = readIds();
    if (current.includes(id)) return save(current.filter((item) => item !== id));
    const candidate = products.find((product) => product.id === id);
    const selectedCategory = products.find((product) => product.id === current[0])?.category;
    if (!candidate || current.length >= 4 || (selectedCategory && selectedCategory !== candidate.category)) return null;
    return save([...current, id]);
  }, [save]);

  return { ids, save, toggle, clear: () => save([]) };
}
