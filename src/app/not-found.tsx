export default function NotFound() {
  return (
    <main className="flex min-h-full min-h-screen flex-col items-center justify-center bg-white">
      <section className="w-full max-w-2xl text-center">
        <h1 className="mb-4 text-3xl font-medium">Recurso não encontrado</h1>
        <p className="text-base font-light text-zinc-600">
          Rota inválida ou não encontrada
        </p>
      </section>
    </main>
  );
}
