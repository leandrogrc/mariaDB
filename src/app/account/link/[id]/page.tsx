"use server";

import { api, HydrateClient } from "@/trpc/server";
import { EditLinkForm } from "./EditLinkForm";
import NotFound from "@/app/not-found";
import { z } from "zod";

const paramsSchema = z.object({ id: z.coerce.number() });

export default async function NewLink(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const input = paramsSchema.safeParse(params);

  if (input.error) {
    return <NotFound />;
  }

  const link = await api.link.getById({ id: input.data.id });

  if (!link) {
    return <NotFound />;
  }

  return (
    <HydrateClient>
      <main className="min-h-full min-h-screen bg-zinc-100">
        <div className="3xl:px-0 mx-auto w-full max-w-7xl px-4 py-4">
          <section className="flex items-center justify-between rounded border border-zinc-300 bg-white px-4">
            <EditLinkForm id={input.data.id} initialValues={link} />
          </section>
        </div>
      </main>
    </HydrateClient>
  );
}
