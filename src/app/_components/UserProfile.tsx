"use client";

import { useState } from "react";
import { ExternalLink } from "react-feather";

import { User } from "@/server/db/schema";
import { api } from "@/trpc/react";

import { UserDropdown } from "./UserDropdown";
import { EditUserForm } from "./EditUserForm";

import { Collapsible, CollapsibleContent } from "../_components/ui/collapsible";

interface UserProfileProps {
  user: Pick<
    User,
    "id" | "name" | "photoUrl" | "description" | "type" | "username"
  >;
}

export function UserProfile({ user: initialData }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);

  const { data: user, refetch } = api.user.getMe.useQuery(undefined, {
    initialData,
  });

  function onSuccess() {
    refetch();
    setIsEditing(false);
  }

  return (
    <>
      <header className="relative mb-6 flex flex-col rounded bg-white">
        <div className="h-42 rounded-t bg-linear-to-r from-cyan-500 to-blue-500"></div>
        <div className="flex flex-1 flex-col items-center rounded-b border-r border-b border-l border-zinc-300 px-8 py-8 md:flex-row md:pr-4 md:pl-8">
          <div className="h-0">
            <img
              alt={`${user.username} profile photo`}
              width={128}
              height={128}
              src={
                user.photoUrl
                  ? user.photoUrl
                  : `https://ui-avatars.com/api/?name=${user.name.replace(
                      /\s/g,
                      "+",
                    )}`
              }
              className="w-32 -translate-y-24 rounded outline-4 outline-white md:mr-8"
            />
          </div>
          <div className="mt-18 flex-1 text-center md:mt-0 md:text-left">
            <h3 className="mb-2 flex flex-col items-center text-2xl font-bold md:mb-0 md:flex-row md:items-baseline">
              <span className="md:mr-1">{user.name}</span>
              <a
                target="_blank"
                href={`/links/${user.username}`}
                className="flex cursor-pointer items-center text-sm font-medium text-zinc-600 transition duration-200 hover:text-indigo-500 md:inline-flex"
              >
                (<span className="mr-1">@{user.username}</span>
                <ExternalLink className="inline h-4 w-4" />)
              </a>
            </h3>
            <p className="text-sm">
              {user.description ? user.description : "Sem descrição"}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <UserDropdown
              isAdmin={user.type === "admin"}
              onEdit={() => setIsEditing(true)}
            />
          </div>
        </div>
      </header>
      <Collapsible open={isEditing}>
        <CollapsibleContent>
          <section className="mb-4 rounded border border-zinc-300 bg-white px-4">
            <h1 className="mt-4 mb-6 text-xl font-medium text-black">
              Editar usuário
            </h1>
            <EditUserForm
              user={user}
              onSuccess={onSuccess}
              onCancel={() => setIsEditing(false)}
            />
          </section>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
