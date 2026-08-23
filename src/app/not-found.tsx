import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="wrap flex flex-1 flex-col items-center justify-center py-28 text-center">
        <h1 className="headline">찾으시는 페이지가 없습니다</h1>
        <p className="mt-4 text-[17px] text-[#6e6e73]">
          주소가 바뀌었거나 목록에서 내려간 제품일 수 있습니다.
        </p>
        <Link href="/" className="btn btn-blue mt-8">
          스토어로 가기
        </Link>
      </main>
      <Footer />
    </div>
  );
}
