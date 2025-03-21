"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw } from "react-feather";
import { classnames } from "@/utils/classnames";

interface AddAdminFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const registerSchema = z
  .object({
    name: z.string(),
    username: z.string().min(5).max(25),
    password: z.string().min(5).max(255),
    confirmPassword: z.string(),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: "Senha e confirmação devem ser o mesmo",
    path: ["password"],
  });

type RegisterSchema = z.infer<typeof registerSchema>;

export function AddAdminForm({ onCancel, onSuccess }: AddAdminFormProps) {
  const addAdmin = api.auth.addAdim.useMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  function onSubmit(data: RegisterSchema) {
    addAdmin.mutate(
      {
        name: data.name,
        username: data.username,
        password: data.password,
      },
      {
        onSuccess,
        onError: (err) => {
          setError("username", { message: err.message }, { shouldFocus: true });
        },
      },
    );
  }

  const errorMessage = errors?.username?.message ?? errors?.password?.message;

  return (
    <form className="mt-4 w-full" onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="mb-4 flex w-full flex-col items-start">
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
          disabled={addAdmin.isPending}
          {...register("name")}
          maxLength={50}
          className="w-full rounded border border-zinc-300 px-4 py-2 text-zinc-800 outline-indigo-500"
        />
      </fieldset>
      <fieldset className="mb-4 flex w-full flex-col items-start">
        <label
          htmlFor="username"
          className="mb-1 block text-sm font-medium text-zinc-600"
        >
          Usuário
        </label>
        <input
          required
          type="text"
          id="username"
          minLength={5}
          maxLength={25}
          disabled={addAdmin.isPending}
          {...register("username")}
          className="w-full rounded border border-zinc-300 px-4 py-2 text-zinc-800 outline-indigo-500"
        />
      </fieldset>
      <div className="flex flex-col md:flex-row md:gap-4">
        <fieldset className="mb-4 flex w-full flex-col items-start">
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-zinc-600"
          >
            Senha
          </label>
          <input
            required
            type="password"
            id="password"
            minLength={6}
            maxLength={255}
            disabled={addAdmin.isPending}
            {...register("password")}
            className="w-full rounded border border-zinc-300 px-4 py-2 text-zinc-800 outline-indigo-500"
          />
        </fieldset>
        <fieldset className="mb-4 flex w-full flex-col items-start">
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-sm font-medium text-zinc-600"
          >
            Confirmar senha
          </label>
          <input
            required
            type="password"
            id="confirmPassword"
            maxLength={255}
            disabled={addAdmin.isPending}
            {...register("confirmPassword")}
            className="w-full rounded border border-zinc-300 px-4 py-2 text-zinc-800 outline-indigo-500"
          />
        </fieldset>
      </div>
      {errorMessage ? (
        <span className="mb-4 block w-full rounded border border-red-400 bg-red-100 px-4 py-2 text-center text-sm text-red-500">
          {errorMessage}
        </span>
      ) : null}
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
          disabled={addAdmin.isPending}
          className={classnames({
            "flex h-10 items-center rounded bg-indigo-500 px-6 py-2 text-center font-medium text-white transition hover:bg-indigo-800":
              true,
            "cursor-pointer": !addAdmin.isPending,
            "cursor-not-allowed": addAdmin.isPending,
          })}
        >
          {addAdmin.isPending ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Salvar
        </button>
      </div>
    </form>
  );
}
