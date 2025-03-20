"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/app/_components/ui/switch";
import { api } from "@/trpc/react";
import { RefreshCw } from "react-feather";

interface SettingsFormProps {
  smtpHost: string | null;
  smtpPort: string | null;
  smtpUser: string | null;
  smtpPass: string | null;
  smtpSecure: boolean;
}

const settingsSchema = z.object({
  host: z.string(),
  port: z.string(),
  user: z.string(),
  pass: z.string(),
  secure: z.boolean().default(false),
});

type SettingsSchema = z.infer<typeof settingsSchema>;

export function SettingsForm({
  smtpHost,
  smtpPort,
  smtpUser,
  smtpPass,
  smtpSecure,
}: SettingsFormProps) {
  const saveEmailConfig = api.admin.saveEmailConfig.useMutation();
  const { register, handleSubmit, setValue } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      host: smtpHost || "",
      port: smtpPort || "",
      user: smtpUser || "",
      pass: smtpPass || "",
      secure: smtpSecure,
    },
  });

  function onSubmit(data: SettingsSchema) {
    saveEmailConfig.mutate({
      smtpHost: data.host,
      smtpPort: data.port,
      smtpUser: data.user,
      smtpPass: data.pass,
      smtpSecure: data.secure,
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 w-full">
      <fieldset className="mb-4 flex w-full flex-col items-start">
        <label
          htmlFor="host"
          className="mb-1 block text-sm font-medium text-zinc-600"
        >
          Servidor
        </label>
        <input
          type="text"
          id="host"
          placeholder="smtp.domain.com"
          defaultValue={smtpHost ?? ""}
          disabled={saveEmailConfig.isPending}
          {...register("host")}
          className="w-full rounded border border-zinc-300 px-4 py-2 text-zinc-800 outline-indigo-500"
        />
      </fieldset>
      <fieldset className="mb-4 flex w-full flex-col items-start">
        <label
          htmlFor="port"
          className="mb-1 block text-sm font-medium text-zinc-600"
        >
          Porta
        </label>
        <input
          type="text"
          id="port"
          placeholder="587"
          defaultValue={smtpPort ?? ""}
          disabled={saveEmailConfig.isPending}
          {...register("port")}
          className="w-full rounded border border-zinc-300 px-4 py-2 text-zinc-800 outline-indigo-500"
        />
      </fieldset>
      <fieldset className="mb-4 flex w-full flex-col items-start">
        <label
          htmlFor="user"
          className="mb-1 block text-sm font-medium text-zinc-600"
        >
          Usuário
        </label>
        <input
          type="text"
          id="user"
          placeholder="user@domain.com"
          defaultValue={smtpUser ?? ""}
          disabled={saveEmailConfig.isPending}
          {...register("user")}
          className="w-full rounded border border-zinc-300 px-4 py-2 text-zinc-800 outline-indigo-500"
        />
      </fieldset>
      <fieldset className="mb-4 flex w-full flex-col items-start">
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium text-zinc-600"
        >
          Senha
        </label>
        <input
          type="password"
          id="password"
          defaultValue={smtpPass ?? ""}
          disabled={saveEmailConfig.isPending}
          {...register("pass")}
          className="w-full rounded border border-zinc-300 px-4 py-2 text-zinc-800 outline-indigo-500"
        />
      </fieldset>
      <div className="mb-4">
        <label
          htmlFor="secure"
          className="mb-2 block text-sm font-medium text-zinc-600"
        >
          Seguro (TLS)
        </label>
        <Switch
          defaultChecked={smtpSecure}
          onCheckedChange={(checked) => setValue("secure", checked)}
          disabled={saveEmailConfig.isPending}
        />
      </div>
      <div className="mt-2 flex items-center justify-end gap-4">
        <button
          type="submit"
          className="flex h-10 cursor-pointer items-center rounded bg-indigo-500 px-6 py-2 text-center font-medium text-white transition hover:bg-indigo-800"
        >
          {saveEmailConfig.isPending ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Salvar
        </button>
      </div>
    </form>
  );
}
