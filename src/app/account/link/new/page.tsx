import { NewLinkForm } from "./NewLinkForm";

export default function NewLink() {
  return (
    <main className="min-h-full min-h-screen bg-zinc-100">
      <div className="3xl:px-0 mx-auto w-full max-w-7xl px-4 py-4">
        <section className="flex items-center justify-between rounded border border-zinc-300 bg-white px-4">
          <NewLinkForm />
        </section>
      </div>
    </main>
  );
}
