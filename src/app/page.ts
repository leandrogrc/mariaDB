import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Index() {
  const session = await auth();

  if (session?.user?.id) {
    return redirect("/account");
  }

  return redirect("/login");
}
