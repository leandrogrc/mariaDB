"use client";

import { signOut } from "next-auth/react";
import { Edit, Lock, LogOut, Monitor, Shield } from "react-feather";

import { User } from "@/server/db/schema";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";

interface AdminDropdownProps {
  user: Pick<User, "name" | "username" | "photoUrl">;
  onEdit: () => void;
  onAddAdmin: () => void;
}

export function AdminDropdown({
  user,
  onEdit,
  onAddAdmin,
}: AdminDropdownProps) {
  function handleLogout() {
    signOut({
      redirectTo: "/login",
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-12 w-12 p-1">
          <img
            src={
              user.photoUrl
                ? user.photoUrl
                : `https://ui-avatars.com/api/?name=${user.name.replace(/\s/g, "+")}`
            }
            className="mx-auto w-10 rounded-full"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <Link
          href="/account"
          className="flex cursor-default items-center gap-2 rounded px-2 py-2 text-sm text-gray-800 transition hover:bg-zinc-100"
        >
          <Monitor className="mr-1 h-4 w-4 text-inherit" />
          Painel do usuário
        </Link>
        <DropdownMenuItem
          className="flex items-center rounded px-2 py-2 text-sm text-gray-800 transition hover:bg-zinc-100"
          onClick={onEdit}
        >
          <Edit className="mr-1 h-4 w-4 text-inherit" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center rounded px-2 py-2 text-sm text-gray-800 transition hover:bg-zinc-100">
          <Lock className="mr-1 h-4 w-4 text-inherit" />
          Alterar senha
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center rounded px-2 py-2 text-sm text-gray-800 transition hover:bg-zinc-100"
          onClick={onAddAdmin}
        >
          <Shield className="mr-1 h-4 w-4 text-inherit" />
          Adicionar admin
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center rounded px-2 py-2 text-sm text-gray-800 transition hover:bg-red-100 hover:text-red-500"
          onClick={handleLogout}
        >
          <LogOut className="mr-1 h-4 w-4 text-inherit" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
