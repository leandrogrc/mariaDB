"use server";

import { redirect } from "next/navigation";
import { api, HydrateClient } from "@/trpc/server";

import { AdminHeader } from "@/app/_components/AdminHeader";
import { LogsList } from "./LogsList";

export default async function LogsPage() {
  const user = await api.user.getMe();
  if (!user || user?.type !== "admin") {
    return redirect("/login");
  }

  await api.log.getLogs.prefetch({ sort: "desc", page: 1, limit: 10 });

  return (
    <HydrateClient>
      <main className="min-h-full min-h-screen bg-zinc-100">
        <div className="3xl:px-0 mx-auto w-full max-w-7xl px-4 py-4">
          <AdminHeader user={user} />
          <LogsList />
        </div>
      </main>
    </HydrateClient>
  );
}
