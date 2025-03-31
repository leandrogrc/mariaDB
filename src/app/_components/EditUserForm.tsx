"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { User } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { classnames } from "@/utils/classnames";
import { RefreshCw } from "lucide-react";

interface EditUserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  user: Pick<
    User,
    "id" | "name" | "photoUrl" | "description" | "type" | "username" | "email"
  >;
}

const userSchema = z.object({
  name: z.string().max(50),
  username: z.string(),
  email: z.string().email(),
  photoUrl: z.string().max(500).nullable(),
  description: z.string().max(50).nullable(),
});

type UserSchema = z.infer<typeof userSchema>;

export function EditUserForm({ user, onSuccess, onCancel }: EditUserFormProps) {
  const updateUser = api.user.updateUser.useMutation();

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user.name,
      username: user.username,
      photoUrl: user.photoUrl,
      email: user.email,
      description: user.description,
    },
  });

  function onSubmit(data: UserSchema) {
    updateUser.mutate(
      {
        name: data.name,
        photoUrl: data.photoUrl || null,
        description: data.description || null,
      },
      {
        onSuccess,
      },
    );
  }

  return (
    <form
      className="mt-4 w-full"
      onSubmit={handleSubmit(onSubmit, console.error)}
    >
      <div className="mb-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <fieldset className="flex w-full flex-col items-start">
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-zinc-600"
          >
            Nome
          </label>
          <input
            required
            type="text"
            id="name"
            maxLength={50}
            {...register("name")}
            className="w-full rounded border border-zinc-300 px-4 py-2 text-zinc-800 outline-indigo-500"
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
            {...register("username")}
            className="w-full cursor-not-allowed rounded border border-zinc-300 bg-zinc-100 px-4 py-2 text-zinc-800 outline-indigo-500"
          />
        </fieldset>
      </div>
      <fieldset className="mb-4 flex w-full flex-col items-start">
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-zinc-600"
        >
          E-mail
        </label>
        <input
          readOnly
          type="text"
          id="email"
          {...register("email")}
          className="w-full cursor-not-allowed rounded border border-zinc-300 bg-zinc-100 px-4 py-2 text-zinc-800 outline-indigo-500"
        />
        <ul>
          <li className="mt-1 text-sm text-orange-500">E-mail não validado</li>
        </ul>
      </fieldset>
      <fieldset className="mb-4 flex w-full flex-col items-start">
        <label
          htmlFor="photoUrl"
          className="mb-1 block text-sm font-medium text-zinc-600"
        >
          Url de foto de perfil
        </label>
        <input
          type="url"
          id="photoUrl"
          maxLength={500}
          {...register("photoUrl")}
          className="w-full rounded border border-zinc-300 px-4 py-2 text-zinc-800 outline-indigo-500"
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
          type="text"
          id="description"
          maxLength={50}
          {...register("description")}
          className="w-full rounded border border-zinc-300 px-4 py-2 text-zinc-800 outline-indigo-500"
        />
      </fieldset>
      <div className="mt-2 mb-4 flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="box-border h-10 cursor-pointer rounded border border-red-500 bg-transparent px-4 py-2 text-center font-medium text-red-500 transition hover:bg-red-100"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={updateUser.isPending}
          className={classnames({
            "flex h-10 items-center rounded bg-indigo-500 px-6 py-2 text-center font-medium text-white transition hover:bg-indigo-800":
              true,
            "cursor-pointer": !updateUser.isPending,
            "cursor-not-allowed": updateUser.isPending,
          })}
        >
          {updateUser.isPending ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Salvar
        </button>
      </div>
    </form>
  );
}
