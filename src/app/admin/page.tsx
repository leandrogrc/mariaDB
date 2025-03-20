"use server";

import { redirect } from "next/navigation";
import { api, HydrateClient } from "@/trpc/server";
import { auth } from "@/server/auth";
import { AdminHeader } from "../_components/AdminHeader";
import { AdminStats } from "../_components/AdminStats";
import { UsersList } from "./UserList";

export default async function AdminPage() {
  const hasAdmin = await api.auth.hasAdmin();
  if (!hasAdmin) {
    return redirect("/admin/register");
  }

  const session = await auth();
  if (!session?.user) {
    return redirect("/login");
  }

  const user = await api.user.getMe();
  if (!user || user?.type !== "admin") {
    return redirect("/login");
  }

  const stats = await api.admin.getStats();
  await api.admin.getUsers.prefetch({
    limit: 10,
    page: 1,
  });

  return (
    <HydrateClient>
      <main className="min-h-full min-h-screen bg-zinc-100">
        <div className="3xl:px-0 mx-auto w-full max-w-7xl px-4 py-4">
          <AdminHeader user={user} />
          <h1 className="mb-6 text-xl font-medium text-black">Estatísticas</h1>
          <AdminStats {...stats} />
          <UsersList />
        </div>
      </main>
    </HydrateClient>
  );
}
