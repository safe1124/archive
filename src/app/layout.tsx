import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Coffee Archive Store - 커피 기구 스토어",
    template: "%s - Coffee Archive",
  },
  description: "드리퍼부터 에스프레소 머신까지, 커피 기구의 사양을 확인하고 나란히 비교해 보세요.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
