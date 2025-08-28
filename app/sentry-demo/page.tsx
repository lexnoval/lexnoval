import { notFound } from "next/navigation";
import SentryClientDemo from "./SentryClientDemo";

export default function Page() {
  // Sadece Preview ortamında göster
  if (process.env.NEXT_PUBLIC_SHOW_DEMOS !== "1") {
    notFound();
  }
  return <SentryClientDemo />;
}

