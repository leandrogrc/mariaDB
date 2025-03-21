"use client";

import { z } from "zod";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/trpc/react";
import { useState } from "react";
import { RegisterFields } from "../_components/RegisterFields";

const registerSchema = z
  .object({
    name: z.string(),
    username: z.string().min(5).max(25),
    password: z.string().min(5).max(255),
    confirmPassword: z.string(),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: "Senha e confirmação devem ser o mesmo",
    path: ["name"],
  });

type RegisterSchema = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isFetching, setIsFetching] = useState(false);
  const registerUser = api.auth.register.useMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  async function handleRegister(data: RegisterSchema) {
    setIsFetching(true);
    registerUser.mutate(
      {
        name: data.name,
        username: data.username,
        password: data.password,
        type: "user",
      },
      {
        onSuccess: () => {
          signIn("credentials", {
            username: data.username,
            password: data.password,
            redirectTo: "/account",
          });
        },
        onError: (e) => {
          setIsFetching(false);
          setError("name", { message: e.message });
        },
      },
    );
  }

  const errorMessage = errors?.username?.message ?? errors?.password?.message;

  return (
    <form
      onSubmit={handleSubmit(handleRegister)}
      className="w-full border-zinc-300 bg-white p-6 text-center md:max-w-md md:rounded md:border md:shadow"
    >
      <h1 className="mb-6 text-3xl font-medium text-black">Registrar</h1>
      <RegisterFields
        register={register}
        errorMessage={errorMessage}
        isPending={registerUser.isPending || isFetching}
      />
      <small className="text-zinc-600">
        Já possui conta?
        <Link href="/login" className="ml-1 text-indigo-500 hover:underline">
          Entre aqui
        </Link>
      </small>
    </form>
  );
}
