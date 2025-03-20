"use server";

import { z } from "zod";
import Link from "next/link";
import { api, HydrateClient } from "@/trpc/server";

import NotFound from "@/app/not-found";
import { AdminHeader } from "@/app/_components/AdminHeader";
import { redirect } from "next/navigation";

const paramsSchema = z.object({ id: z.coerce.number() });

export default async function UserDetails(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const input = paramsSchema.safeParse(params);

  if (input.error) {
    return <NotFound />;
  }

  const currentUser = await api.user.getMe();
  if (!currentUser || currentUser?.type !== "admin") {
    return redirect("/login");
  }

  const user = await api.user.getById({ userId: input.data.id });

  if (!user) {
    return <NotFound />;
  }

  return (
    <HydrateClient>
      <main className="min-h-full min-h-screen bg-zinc-100">
        <div className="3xl:px-0 mx-auto w-full max-w-7xl px-4 py-4">
          <AdminHeader user={currentUser} />
          <section className="mb-4 rounded border border-zinc-300 bg-white px-4 transition">
            <h1 className="mt-4 mb-6 text-xl font-medium text-black">
              Ver usuário
            </h1>
            <div className="mb-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
              <fieldset className="flex w-full flex-col items-start">
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm font-medium text-zinc-600"
                >
                  Nome
                </label>
                <input
                  readOnly
                  type="text"
                  id="name"
                  name="name"
                  value={user.name}
                  maxLength={50}
                  className="w-full cursor-not-allowed rounded border border-zinc-300 bg-zinc-100 px-4 py-2 text-zinc-800 outline-indigo-500"
                />
              </fieldset>
              <fieldset className="flex w-full flex-col items-start">
                <label
                  htmlFor="username"
                  className="mb-1 block text-sm font-medium text-zinc-600"
                >
                  Usuário
                </label>
                <input
                  readOnly
                  type="text"
                  id="username"
                  name="username"
                  className="w-full cursor-not-allowed rounded border border-zinc-300 bg-zinc-100 px-4 py-2 text-zinc-800 outline-indigo-500"
                  value={user.username}
                />
              </fieldset>
            </div>
            <fieldset className="mb-4 flex w-full flex-col items-start">
              <label
                htmlFor="photoUrl"
                className="mb-1 block text-sm font-medium text-zinc-600"
              >
                Url de foto de perfil
              </label>
              <input
                readOnly
                type="url"
                id="photoUrl"
                name="photoUrl"
                maxLength={500}
                className="w-full cursor-not-allowed rounded border border-zinc-300 bg-zinc-100 px-4 py-2 text-zinc-800 outline-indigo-500"
                value={user.photoUrl ?? ""}
              />
            </fieldset>
            <fieldset className="mb-4 flex w-full flex-col items-start">
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium text-zinc-600"
              >
                Descrição
              </label>
              <input
                readOnly
                type="text"
                id="description"
                name="description"
                maxLength={50}
                className="w-full cursor-not-allowed rounded border border-zinc-300 bg-zinc-100 px-4 py-2 text-zinc-800 outline-indigo-500"
                value={user.description ?? ""}
              />
            </fieldset>
            <div className="mt-2 mb-4 flex items-center justify-end gap-4">
              <Link
                href="/admin"
                className="h-10 cursor-pointer rounded border border-zinc-400 bg-transparent px-4 py-2 text-center font-medium text-zinc-600"
              >
                Voltar
              </Link>
            </div>
          </section>
        </div>
      </main>
    </HydrateClient>
  );
}
