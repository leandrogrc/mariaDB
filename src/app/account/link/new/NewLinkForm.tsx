"use client";

import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/trpc/react";

import { Switch } from "@/app/_components/ui/switch";
import { classnames } from "@/utils/classnames";

const linkSchema = z.object({
  title: z.string().max(255),
  link: z.string().url().max(255),
  active: z.boolean().default(false),
});

type LinkSchema = z.infer<typeof linkSchema>;

export function NewLinkForm() {
  const router = useRouter();
  const addLink = api.link.create.useMutation();
  const getLinksCall = api.useUtils().link.getLinks;

  const { register, setValue, handleSubmit } = useForm({
    resolver: zodResolver(linkSchema),
  });

  function onSubmit(data: LinkSchema) {
    addLink.mutate(
      {
        title: data.title,
        link: data.link,
        active: data.active,
      },
      {
        onSuccess: () => {
          getLinksCall.invalidate();
          router.push("/account");
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full">
      <h1 className="mt-4 mb-6 text-xl font-medium text-black">Criar link</h1>
      <fieldset className="mb-4 flex w-full flex-col items-start">
        <label
          htmlFor="title"
          className="mb-1 block text-sm font-medium text-zinc-600"
        >
          Título
        </label>
        <input
          required
          type="text"
          id="title"
          maxLength={255}
          {...register("title")}
          className="w-full rounded border border-zinc-300 px-4 py-2 text-zinc-800 outline-indigo-500"
        />
      </fieldset>
      <fieldset className="mb-4 flex w-full flex-col items-start">
        <label
          htmlFor="link"
          className="mb-1 block text-sm font-medium text-zinc-600"
        >
          Url
        </label>
        <input
          type="url"
          id="link"
          maxLength={255}
          {...register("link")}
          className="w-full rounded border border-zinc-300 px-4 py-2 text-zinc-800 outline-indigo-500"
        />
      </fieldset>
      <div className="mb-4">
        <label
          htmlFor="active"
          className="mb-2 block text-sm font-medium text-zinc-600"
        >
          Ativo
        </label>
        <div>
          <Switch onCheckedChange={(checked) => setValue("active", checked)} />
        </div>
      </div>
      <div className="mt-2 mb-4 flex items-center justify-end gap-4">
        <Link
          href="/account"
          className="box-border h-10 cursor-pointer rounded border border-red-500 bg-transparent px-4 py-2 text-center font-medium text-red-500 transition hover:bg-red-100"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={addLink.isPending}
          className={classnames({
            "flex h-10 cursor-pointer items-center rounded bg-indigo-500 px-6 py-2 text-center font-medium text-white transition hover:bg-indigo-800":
              true,
            "cursor-pointer": !addLink.isPending,
            "cursor-not-allowed": addLink.isPending,
          })}
        >
          Criar
        </button>
      </div>
    </form>
  );
}
