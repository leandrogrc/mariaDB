"use client";

import Link from "next/link";
import { CornerDownRight, MoreVertical, Edit, Trash } from "react-feather";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../_components/ui/dropdown-menu";
import { api } from "@/trpc/react";

interface LinkFieldProps {
  id: number;
  title: string;
  link: string;
  active: boolean;
  onDelete: () => void;
}

export function LinkField({
  id,
  active,
  link,
  title,
  onDelete,
}: LinkFieldProps) {
  const deleteLink = api.link.deleteById.useMutation();

  function handleDelete() {
    deleteLink.mutate(
      { id },
      {
        onSuccess: onDelete,
      },
    );
  }

  return (
    <article className="relative flex items-center justify-between rounded border border-zinc-300 bg-white p-4">
      <div>
        <h3 className="text-md flex items-center font-medium">
          <span className="mr-2">{title}</span>
          {!active ? (
            <span className="rounded-full bg-zinc-400 px-2 py-0.5 text-center text-xs text-zinc-800">
              Inativo
            </span>
          ) : null}
        </h3>
        <div className="flex w-full items-center text-zinc-600">
          <CornerDownRight className="mr-1 inline h-4 w-4" />
          <a
            className="max-w-2xs truncate text-sm hover:underline"
            href={link}
            target="_blank"
          >
            {link}
          </a>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded transition hover:bg-zinc-100">
            <MoreVertical className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <Link
            className="flex cursor-default items-center gap-2 rounded px-2 py-2 text-sm text-gray-800 transition hover:bg-zinc-100"
            href={`/account/link/${id}`}
          >
            <Edit className="mr-1 h-4 w-4 text-inherit" />
            Editar
          </Link>
          <DropdownMenuItem
            className="flex items-center rounded px-2 py-2 text-sm text-gray-800 transition hover:bg-red-100 hover:text-red-500"
            onClick={handleDelete}
          >
            <Trash className="mr-1 h-4 w-4 text-inherit" />
            Remover
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </article>
  );
}
