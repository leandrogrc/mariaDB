import Link from "next/link";
import { Eye, Layers, MoreHorizontal } from "react-feather";
import { ColumnDef } from "@tanstack/react-table";
import { Skeleton } from "../_components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../_components/ui/dropdown-menu";

export interface UserItem {
  id: number;
  username: string;
  name: string;
  description: string | null;
  photoUrl: string | null;
  type: "admin" | "user";
  links: number;
}

export const getColumns = (isLoading: boolean): ColumnDef<UserItem>[] => [
  {
    id: "user",
    header: "Usuário",
    cell: ({ row }) =>
      isLoading ? (
        <Skeleton className="h-4 w-full" />
      ) : (
        <div className="flex w-full items-center">
          <img
            src={
              row.original.photoUrl
                ? row.original.photoUrl
                : `https://ui-avatars.com/api/?name=${row.original.name.replace(/\s/g, "+")}`
            }
            className="mr-4 ml-2 w-8 rounded-full"
          />
          <p>{row.original.username}</p>
        </div>
      ),
  },
  {
    id: "name",
    header: "Nome",
    accessorKey: "name",
    cell: ({ row }) =>
      isLoading ? (
        <Skeleton className="h-4 w-full" />
      ) : (
        <p>{row.original.name}</p>
      ),
  },
  {
    id: "description",
    header: "Descrição",
    accessorKey: "description",
    cell: ({ row }) =>
      isLoading ? (
        <Skeleton className="h-4 w-full" />
      ) : (
        <p>
          {row.original.description
            ? row.original.description
            : "Não informado"}
        </p>
      ),
  },
  {
    id: "type",
    header: "Tipo",
    accessorKey: "type",
    cell: ({ row }) =>
      isLoading ? (
        <Skeleton className="h-4 w-full" />
      ) : (
        <p className="w-fit rounded-full bg-indigo-500 px-2 py-1 text-white">
          {row.original.type === "admin" ? "Administrador" : "Usuário"}
        </p>
      ),
  },
  {
    id: "links",
    header: "Links",
    accessorKey: "links",
    cell: ({ row }) =>
      isLoading ? (
        <Skeleton className="h-4 w-full" />
      ) : (
        <p>{row.original.links}</p>
      ),
  },
  {
    id: "actions",
    cell: ({ row }) =>
      isLoading ? (
        <Skeleton className="h-4 w-full" />
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="mx-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded transition hover:bg-zinc-100">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link
              className="flex items-center gap-2 rounded px-2 py-2 text-sm text-gray-800 transition hover:bg-zinc-100"
              href={`/admin/user/${row.original.id}`}
            >
              <Eye className="mr-1 h-4 w-4 text-inherit" />
              Ver conta
            </Link>
            <Link
              className="flex items-center gap-2 rounded px-2 py-2 text-sm text-gray-800 transition hover:bg-zinc-100"
              href={`/admin/logs?userId=${row.original.id}`}
            >
              <Layers className="mr-1 h-4 w-4 text-inherit" />
              Ver logs
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
  },
];
