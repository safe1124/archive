import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 같은 Wi-Fi의 휴대폰에서 개발 서버를 열 때, Next의 개발용 클라이언트 자산과
  // 수화 요청이 localhost 외의 LAN origin에서도 동작하도록 허용합니다.
  allowedDevOrigins: ["172.30.1.67"],
};

export default nextConfig;
