"use server";

import { redirect } from "next/navigation";
import { RegisterAdminForm } from "./RegisterAdminForm";
import { api, HydrateClient } from "@/trpc/server";

export default async function RegisterAdmin() {
  const hasAdmin = await api.auth.hasAdmin();

  if (hasAdmin) {
    return redirect("/login");
  }

  return (
    <HydrateClient>
      <main className="flex min-h-full min-h-screen flex-col items-center justify-center bg-white md:bg-zinc-100">
        <RegisterAdminForm />
      </main>
    </HydrateClient>
  );
}
