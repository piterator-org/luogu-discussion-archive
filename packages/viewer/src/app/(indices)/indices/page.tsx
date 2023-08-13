import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Page() {
  return redirect("/indices/1");
}
