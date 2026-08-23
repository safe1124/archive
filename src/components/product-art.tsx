"use client";

import { useState } from "react";
import { getProductImage, type Product } from "@/lib/products";

/**
 * 제품 사진 대신 쓰는 정면 도면 일러스트.
 * 형태(form)별로 한 장씩 그려두고, 제품의 tone 값을 본체 색으로 씁니다.
 */
export function ProductArt({ product, className, compact = false }: { product: Product; className?: string; compact?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);
  const image = getProductImage(product);
  // 배경은 부르는 쪽에서 정합니다. 사진 대부분이 흰 배경이라 어디에 얹느냐로 인상이 갈립니다.
  const visualClass = className ?? (compact ? "h-36 w-full bg-[#f5f5f7]" : "h-44 w-full bg-[#f5f5f7]");
  const body = product.tone;
  const dark = isDark(body);
  const edge = dark ? "rgba(255,255,255,.24)" : "rgba(0,0,0,.18)";
  const deep = dark ? "#111" : "#3c3c3e";
  const glass = "rgba(0,0,0,.05)";
  const steel = "#a1a1a6";

  if (image && !imageFailed) {
    return (
      <div className={`relative overflow-hidden ${visualClass}`}>
        {/* 외부 원본은 상세 페이지의 ‘이미지 출처’ 링크에서 확인할 수 있습니다. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.src} alt={`${product.brand} ${product.name} 제품 사진`} onError={() => setImageFailed(true)} className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-[1.03]" />
      </div>
    );
  }

  return (
    <svg viewBox="0 0 240 200" role="img" aria-label={`${product.brand} ${product.name} 일러스트`} className={visualClass}>
      <ellipse cx="120" cy="182" rx="58" ry="6" fill="rgba(0,0,0,.06)" />

      {product.form === "cone" && (
        <g stroke={edge} strokeWidth="1.4">
          <ellipse cx="120" cy="158" rx="30" ry="7" fill={body} />
          <path d="M104 132h32v22a16 7 0 0 1-32 0z" fill={body} />
          <path d="M55 54h130l-46 80h-38z" fill={body} />
          <path d="M120 66v62M96 62l24 66M144 62l-24 66" stroke={edge} strokeWidth="1" fill="none" opacity=".55" />
          <ellipse cx="120" cy="54" rx="65" ry="13" fill={body} />
          <ellipse cx="120" cy="54" rx="57" ry="10" fill="rgba(0,0,0,.07)" stroke="none" />
          <path d="M180 66c26 10 26 44-22 56" fill="none" stroke={body} strokeWidth="10" strokeLinecap="round" />
          <path d="M180 66c26 10 26 44-22 56" fill="none" stroke={edge} strokeWidth="1.2" strokeLinecap="round" />
        </g>
      )}

      {product.form === "flat" && (
        <g stroke={edge} strokeWidth="1.4">
          <ellipse cx="120" cy="150" rx="28" ry="6" fill={body} />
          <path d="M96 132h48v14a24 6 0 0 1-48 0z" fill={body} />
          <path d="M54 58h132l-34 74H88z" fill={body} />
          <ellipse cx="120" cy="132" rx="32" ry="7" fill={body} />
          <ellipse cx="120" cy="58" rx="66" ry="13" fill={body} />
          <ellipse cx="120" cy="58" rx="58" ry="10" fill="rgba(0,0,0,.07)" stroke="none" />
          <path d="M92 68l-2 60M120 68v60M148 68l2 60" stroke={edge} strokeWidth="1" fill="none" opacity=".45" />
          <path d="M184 68c20 8 18 34-16 44" fill="none" stroke={body} strokeWidth="9" strokeLinecap="round" />
          <path d="M184 68c20 8 18 34-16 44" fill="none" stroke={edge} strokeWidth="1.2" strokeLinecap="round" />
        </g>
      )}

      {product.form === "grinder" && (
        <g stroke={edge} strokeWidth="1.4">
          <path d="M120 40v22" stroke={deep} strokeWidth="6" strokeLinecap="round" />
          <path d="M120 42h34" stroke={deep} strokeWidth="6" strokeLinecap="round" />
          <circle cx="160" cy="42" r="8" fill={deep} stroke="none" />
          <rect x="90" y="58" width="60" height="12" rx="4" fill={deep} stroke="none" />
          <rect x="88" y="70" width="64" height="94" rx="14" fill={body} />
          <path d="M88 122h64" stroke={edge} strokeWidth="1" opacity=".6" />
          <rect x="98" y="86" width="14" height="26" rx="7" fill="rgba(255,255,255,.22)" stroke="none" />
          <ellipse cx="120" cy="166" rx="30" ry="7" fill={steel} stroke={edge} />
          <path d="M96 166h48" stroke="rgba(0,0,0,.2)" strokeWidth="1" />
        </g>
      )}

      {product.form === "machine" && (
        <g stroke={edge} strokeWidth="1.4">
          <rect x="60" y="38" width="120" height="90" rx="12" fill={body} />
          <rect x="60" y="38" width="120" height="16" rx="8" fill="rgba(0,0,0,.08)" stroke="none" />
          <circle cx="80" cy="70" r="7" fill={deep} stroke="none" />
          <circle cx="102" cy="70" r="7" fill={deep} stroke="none" />
          <circle cx="160" cy="70" r="5" fill="#ff6b35" stroke="none" />
          <rect x="104" y="126" width="34" height="12" rx="3" fill={deep} stroke="none" />
          <rect x="112" y="138" width="18" height="8" rx="2" fill={steel} stroke="none" />
          <path d="M138 140h30" stroke={deep} strokeWidth="6" strokeLinecap="round" />
          <path d="M172 100c8 8 8 26 0 34" fill="none" stroke={steel} strokeWidth="5" strokeLinecap="round" />
          <path d="M108 150h26l-4 18h-18z" fill="#fff" stroke={edge} />
          <rect x="58" y="168" width="124" height="10" rx="4" fill={steel} stroke={edge} />
        </g>
      )}

      {product.form === "server" && (
        <g stroke={edge} strokeWidth="1.4">
          <path d="M84 66v78c0 16 16 24 36 24s36-8 36-24V66z" fill={glass} />
          <path d="M84 118v26c0 16 16 24 36 24s36-8 36-24v-26z" fill={body} stroke="none" opacity=".85" />
          <path d="M84 118v26c0 16 16 24 36 24s36-8 36-24v-26" fill="none" stroke={edge} />
          <rect x="76" y="52" width="88" height="14" rx="7" fill={deep} stroke="none" />
          <path d="M160 86c22 4 22 40 0 44" fill="none" stroke={deep} strokeWidth="7" strokeLinecap="round" />
          <path d="M92 92h12M92 106h12" stroke={edge} strokeWidth="1.4" strokeLinecap="round" />
          <rect x="96" y="70" width="8" height="40" rx="4" fill="rgba(255,255,255,.5)" stroke="none" />
        </g>
      )}

      {product.form === "filter" && (
        <g stroke={edge} strokeWidth="1.4">
          <path d="M84 68q36-16 72 0l-36 96z" fill="rgba(0,0,0,.06)" transform="rotate(-7 120 116)" />
          <path d="M84 62q36-16 72 0l-36 98z" fill={body} />
          <path d="M84 62q36-16 72 0" fill="none" stroke={edge} />
          <path d="M120 54v106" stroke={edge} strokeWidth="1" opacity=".5" />
          <path d="M100 58l12 100M140 58l-12 100" stroke={edge} strokeWidth="1" opacity=".35" />
        </g>
      )}

      {product.form === "press" && (
        <g stroke={edge} strokeWidth="1.4">
          <circle cx="120" cy="30" r="10" fill={deep} stroke="none" />
          <rect x="117" y="36" width="6" height="24" fill={deep} stroke="none" />
          <rect x="78" y="52" width="84" height="14" rx="7" fill={deep} stroke="none" />
          <rect x="86" y="66" width="68" height="102" rx="10" fill={glass} />
          <path d="M86 116h68v42a10 10 0 0 1-10 10H96a10 10 0 0 1-10-10z" fill={body} stroke="none" opacity=".85" />
          <rect x="86" y="66" width="68" height="102" rx="10" fill="none" stroke={edge} />
          <path d="M92 108h56" stroke={edge} strokeWidth="1.4" />
          <path d="M158 84c22 6 22 38 0 44" fill="none" stroke={deep} strokeWidth="7" strokeLinecap="round" />
          <rect x="96" y="76" width="8" height="30" rx="4" fill="rgba(255,255,255,.5)" stroke="none" />
        </g>
      )}
    </svg>
  );
}

function isDark(hex: string) {
  const value = hex.replace("#", "");
  if (value.length !== 6) return false;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b < 110;
}
