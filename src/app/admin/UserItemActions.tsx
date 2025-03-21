"use client";

import Link from "next/link";
import { Eye, Layers, MoreHorizontal, Shield } from "react-feather";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../_components/ui/dropdown-menu";
import { UserItem } from "./columns";
import { api } from "@/trpc/react";

interface UserItemActionsProps {
  user: UserItem;
}

export function UserItemActions({ user }: UserItemActionsProps) {
  const utils = api.useUtils();
  const changeUserType = api.admin.changeUserType.useMutation();

  function onChangeType() {
    changeUserType.mutate(
      {
        userId: user.id,
        type: user.type === "admin" ? "user" : "admin",
      },
      {
        onSuccess: () => {
          utils.admin.getUsers.invalidate();
        },
      },
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="mx-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded transition hover:bg-zinc-100">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="flex items-center rounded px-2 py-2 text-sm text-gray-800 transition hover:bg-zinc-100"
          onClick={onChangeType}
        >
          <Shield className="mr-1 h-4 w-4 text-inherit" />
          {user.type === "admin" ? "Tornar usuário" : "Tornar admin"}
        </DropdownMenuItem>
        <Link
          className="flex items-center gap-2 rounded px-2 py-2 text-sm text-gray-800 transition hover:bg-zinc-100"
          href={`/admin/user/${user.id}`}
        >
          <Eye className="mr-1 h-4 w-4 text-inherit" />
          Ver conta
        </Link>
        <Link
          className="flex items-center gap-2 rounded px-2 py-2 text-sm text-gray-800 transition hover:bg-zinc-100"
          href={`/admin/logs?userId=${user.id}`}
        >
          <Layers className="mr-1 h-4 w-4 text-inherit" />
          Ver logs
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
