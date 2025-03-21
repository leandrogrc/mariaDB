"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Edit, Settings, Lock, LogOut, Shield } from "react-feather";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../_components/ui/dropdown-menu";

interface UserDropdownProps {
  isAdmin: boolean;
  onEdit: () => void;
}

export function UserDropdown({ isAdmin, onEdit }: UserDropdownProps) {
  function handleLogout() {
    signOut({
      redirectTo: "/login",
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex cursor-pointer items-center rounded bg-indigo-500 px-6 py-2 text-white transition hover:bg-indigo-800">
          <Settings className="mr-2 h-4 w-4" />
          Configurações
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        {isAdmin ? (
          <Link
            href="/admin"
            className="flex cursor-default items-center gap-2 rounded px-2 py-2 text-sm text-gray-800 transition hover:bg-zinc-100"
          >
            <Shield className="mr-1 h-4 w-4 text-inherit" />
            Painel Admin
          </Link>
        ) : null}
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
