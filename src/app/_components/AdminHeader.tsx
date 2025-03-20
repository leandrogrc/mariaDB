"use client";

import { User } from "@/server/db/schema";
import { useState } from "react";
import { api } from "@/trpc/react";

import { AdminDropdown } from "./AdminDropdown";
import { EditUserForm } from "./EditUserForm";
import { Collapsible, CollapsibleContent } from "./ui/collapsible";
import { AddAdminForm } from "./AddAdminForm";
import { AdminNavigation } from "./AdminNavigation";

interface AdminHeaderProps {
  user: Pick<
    User,
    "id" | "name" | "username" | "photoUrl" | "type" | "description"
  >;
}

export function AdminHeader({ user: initialData }: AdminHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [addAdmin, setAddAdmin] = useState(false);

  const { data: user, refetch } = api.user.getMe.useQuery(undefined, {
    initialData,
  });

  function onSuccess() {
    refetch();
    setIsEditing(false);
  }

  return (
    <>
      <header className="relative mb-4 flex items-center justify-between rounded border border-zinc-300 bg-white px-4 py-2">
        <h1 className="text-lg font-medium">Painel Admin</h1>
        <AdminDropdown
          user={user}
          onEdit={() => setIsEditing(true)}
          onAddAdmin={() => setAddAdmin(true)}
        />
      </header>
      <AdminNavigation />
      <Collapsible open={isEditing}>
        <CollapsibleContent>
          <section className="mb-4 rounded border border-zinc-300 bg-white px-4">
            <h1 className="mt-4 mb-6 text-xl font-medium text-black">
              Editar Admin
            </h1>
            <EditUserForm
              user={user}
              onSuccess={onSuccess}
              onCancel={() => setIsEditing(false)}
            />
          </section>
        </CollapsibleContent>
      </Collapsible>
      <Collapsible open={addAdmin}>
        <CollapsibleContent>
          <section className="mb-4 rounded border border-zinc-300 bg-white px-4">
            <h1 className="mt-4 mb-6 text-xl font-medium text-black">
              Adicionar Admin
            </h1>
            <AddAdminForm
              onSuccess={() => setAddAdmin(false)}
              onCancel={() => setAddAdmin(false)}
            />
          </section>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
