import { api, HydrateClient } from "@/trpc/server";
import { UserNotFound } from "@/app/_components/UserNotFound";

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const { user, links } = await api.user.getByUsername({
    username,
  });

  if (!user) {
    return <UserNotFound username={username} />;
  }

  return (
    <HydrateClient>
      <main className="background flex min-h-full min-h-screen flex-col items-center justify-center bg-zinc-950 text-white">
        <section className="mb-8 w-full max-w-2xl">
          <img
            src={
              user.photoUrl
                ? user.photoUrl
                : `https://ui-avatars.com/api/?name=${user.name.replace(
                    /\s/g,
                    "+",
                  )}`
            }
            className="mx-auto mb-4 w-32 rounded-full"
          />
          <p className="text-center">
            <span className="font-medium">{user.name}</span>
            <br />
            <span className="font-light">{user.description}</span>
          </p>
        </section>
        <section className="w-full max-w-md px-5">
          {links.map(({ id, title, link }) => (
            <a
              key={id}
              href={link}
              className="group mb-6 block w-full border border-white text-center"
            >
              <div className="group-hover block w-full bg-white px-4 py-2 text-black transition ease-out group-hover:-translate-x-[8px] group-hover:-translate-y-[10px]">
                {title}
              </div>
            </a>
          ))}
        </section>
      </main>
    </HydrateClient>
  );
}
