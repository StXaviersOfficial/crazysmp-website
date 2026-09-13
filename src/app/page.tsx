import { redirect } from "next/navigation";

export default function RootPage() {
  // Main page is the store — redirect / → /store
  redirect("/store");
}
