<<<<<<< HEAD
import SentryClientDemo from '../SentryClientDemo';

export default function Page() {
=======
import { notFound } from "next/navigation";
import SentryClientDemo from "./SentryClientDemo";

export default function Page() {
  if (process.env.NEXT_PUBLIC_SHOW_DEMOS !== "1") notFound();
>>>>>>> main
  return <SentryClientDemo />;
}
