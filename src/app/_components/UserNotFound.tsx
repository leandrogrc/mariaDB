"use client";

export function UserNotFound({ username }: { username: string }) {
  return (
    <main className="bg-white min-h-full min-h-screen flex flex-col justify-center items-center">
      <section className="w-full max-w-2xl text-center">
        <h1 className="text-3xl font-medium mb-4">Usuário não encontrado</h1>
        <p className="text-zinc-600 text-base font-light">
          Não foi possível encontrar dados de
          <span className="font-medium">{username}</span>
        </p>
      </section>
    </main>
  );
}
