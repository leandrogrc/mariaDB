"use server";

import { redirect } from "next/navigation";
import { api, HydrateClient } from "@/trpc/server";

import { AdminHeader } from "@/app/_components/AdminHeader";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const user = await api.user.getMe();
  if (!user || user?.type !== "admin") {
    return redirect("/login");
  }

  const emailConfig = await api.admin.getEmailConfig();

  return (
    <HydrateClient>
      <main className="min-h-full min-h-screen bg-zinc-100">
        <div className="3xl:px-0 mx-auto w-full max-w-7xl px-4 py-4">
          <AdminHeader user={user} />
          <section className="rounded border border-zinc-300 bg-white p-4">
            <h1 className="mb-6 text-xl font-medium text-black">
              Configurações de SMTP
            </h1>
            <SettingsForm {...emailConfig} />
          </section>
        </div>
      </main>
    </HydrateClient>
  );
}
