import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";

import { UserProfile } from "../_components/UserProfile";
import { LinksList } from "../_components/LinksList";

export default async function Account() {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/login");
  }

  const user = await api.user.getMe();
  if (!user) {
    return await signOut({
      redirectTo: "/login",
    });
  }

  const links = await api.link.getLinks();

  return (
    <HydrateClient>
      <main className="min-h-full min-h-screen bg-zinc-100">
        <div className="3xl:px-0 mx-auto w-full max-w-7xl px-4 py-4">
          <UserProfile user={user} />
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-medium text-black">Meus links</h1>
            <Link
              href="/account/link/new"
              className="rounded bg-indigo-500 px-6 py-2 text-center font-medium text-white transition hover:bg-indigo-800"
            >
              Adicionar
            </Link>
          </div>
          <LinksList links={links} />
        </div>
      </main>
    </HydrateClient>
  );
}
