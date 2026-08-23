import { Suspense } from "react";
import { ArchiveBrowser } from "@/components/archive-browser";

export default function Home() {
  return (
    <Suspense>
      <ArchiveBrowser />
    </Suspense>
  );
}
