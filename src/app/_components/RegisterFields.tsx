"use client";

import { RefreshCw } from "react-feather";
import type { UseFormRegister } from "react-hook-form";
import { classnames } from "@/utils/classnames";

interface RegisterSchema {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFieldsProps {
  register: UseFormRegister<RegisterSchema>;
  errorMessage: string | undefined;
  isPending: boolean;
}

export function RegisterFields({
  register,
  errorMessage,
  isPending,
}: RegisterFieldsProps) {
  return (
    <>
      <fieldset className="mb-4 flex w-full flex-col items-start">
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-medium text-zinc-600"
        >
          Nome
        </label>
        <input
          required
          id="name"
          type="text"
          maxLength={50}
          disabled={isPending}
          {...register("name")}
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
          id="username"
          type="text"
          minLength={5}
          maxLength={25}
          disabled={isPending}
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
            id="password"
            type="password"
            maxLength={255}
            disabled={isPending}
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
            disabled={isPending}
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
      <button
        type="submit"
        disabled={isPending}
        className={classnames({
          "mt-2 mb-4 flex w-full cursor-pointer items-center justify-center rounded bg-indigo-500 py-2 text-center text-lg font-medium text-white transition hover:bg-indigo-800":
            true,
          "cursor-pointer": !isPending,
          "cursor-not-allowed": isPending,
        })}
      >
        {isPending ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
        Registrar
      </button>
    </>
  );
}
