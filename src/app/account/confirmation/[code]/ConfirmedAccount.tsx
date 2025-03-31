import Link from "next/link";

export default function ConfirmedAccount() {
  return (
    <main className="flex min-h-full min-h-screen flex-col items-center justify-center bg-white">
      <section className="w-full max-w-2xl text-center">
        <h1 className="mb-4 text-3xl font-medium">
          Código de confirmação validado
        </h1>
        <p className="mb-4 text-base font-light text-zinc-600">
          Sua conta já foi devidamente verificada
        </p>
        <Link
          href="/account"
          className="inline-block rounded bg-indigo-500 px-3 py-2 text-center font-medium text-white transition hover:bg-indigo-800"
        >
          Voltar ao painel
        </Link>
      </section>
    </main>
  );
}
