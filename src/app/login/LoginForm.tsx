"use client";

import { z } from "zod";
import { RefreshCw } from "react-feather";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { classnames } from "@/utils/classnames";

const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(5).max(255),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isFetching, setIsFetching] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  async function handleLogin(data: LoginSchema) {
    setIsFetching(true);
    const response = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (response?.error) {
      setIsFetching(false);
      setError("email", { message: response.code });
      return;
    }

    redirect("/account");
  }

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="w-full border-zinc-300 bg-white p-6 text-center md:max-w-sm md:rounded md:border md:shadow"
    >
      <h1 className="mb-6 text-3xl font-medium text-black">Entrar</h1>
      <fieldset className="mb-4 flex w-full flex-col items-start">
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-zinc-600"
        >
          E-mail
        </label>
        <input
          required
          id="email"
          type="email"
          minLength={5}
          maxLength={25}
          disabled={isFetching}
          {...register("email")}
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
          required
          type="password"
          id="password"
          maxLength={255}
          disabled={isFetching}
          {...register("password")}
          className="w-full rounded border border-zinc-300 px-4 py-2 text-zinc-800 outline-indigo-500"
        />
      </fieldset>
      {errors?.email?.message ? (
        <span className="mb-4 block w-full rounded border border-red-400 bg-red-100 px-4 py-2 text-center text-sm text-red-500">
          {errors.email.message}
        </span>
      ) : null}
      <button
        type="submit"
        disabled={isFetching}
        className={classnames({
          "mt-2 mb-4 flex w-full cursor-pointer items-center justify-center rounded bg-indigo-500 py-2 text-center text-lg font-medium text-white transition hover:bg-indigo-800":
            true,
          "cursor-pointer": !isFetching,
          "cursor-not-allowed": isFetching,
        })}
      >
        {isFetching ? (
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        Entrar
      </button>
      <small className="text-zinc-600">
        Não possui conta?
        <Link href="/register" className="ml-1 text-indigo-500 hover:underline">
          Registre-se
        </Link>
      </small>
    </form>
  );
}
