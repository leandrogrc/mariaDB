import { ColumnDef } from "@tanstack/react-table";

import { Skeleton } from "@/app/_components/ui/skeleton";
import { LogSheet } from "./LogSheet";
import { classnames } from "@/utils/classnames";
import { ArrowDown } from "react-feather";

export interface LogItem {
  id: number;
  title: string;
  details: string | null;
  type: "log" | "error";
  username: string | null;
  userId: number | null;
  stack: string | null;
  createdAt: Date;
}

export const getColumns = ({
  isLoading,
  onSelectUser,
}: {
  isLoading: boolean;
  onSelectUser: (id: number) => void;
}): ColumnDef<LogItem>[] => [
  {
    id: "createdAt",
    accessorKey: "createdAt",
    size: 180,
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 transition hover:bg-zinc-200"
      >
        Data
        <ArrowDown
          className={classnames({
            "h-4 w-4 transition": true,
            "rotate-180": column.getIsSorted() === "asc",
          })}
        />
      </button>
    ),
    cell: ({ row }) =>
      isLoading ? (
        <Skeleton className="h-4 w-full" />
      ) : (
        <span>{row.original.createdAt.toLocaleString()}</span>
      ),
  },
  {
    id: "type",
    header: "Tipo",
    accessorKey: "type",
    size: 60,
    cell: ({ row }) =>
      isLoading ? (
        <Skeleton className="h-4 w-full" />
      ) : (
        <span
          className={classnames({
            "rounded px-2 py-1": true,
            "bg-orange-400 text-white": row.original.type === "log",
            "bg-red-500 text-white": row.original.type === "error",
          })}
        >
          {row.original.type}
        </span>
      ),
  },
  {
    id: "userId",
    header: "Usuário",
    accessorKey: "userId",
    size: 240,
    cell: ({ row }) =>
      isLoading ? (
        <Skeleton className="h-4 w-full" />
      ) : (
        <button
          className="w-fit cursor-pointer rounded bg-zinc-200 px-2 py-1 text-sm text-zinc-800"
          onClick={() => {
            if (row.original.userId) {
              onSelectUser(row.original.userId);
            }
          }}
        >
          {row.original.username ?? "Não informado"}
        </button>
      ),
  },
  {
    id: "title",
    header: "Título",
    accessorKey: "title",
    size: 400,
    cell: ({ row }) =>
      isLoading ? (
        <Skeleton className="h-4 w-full" />
      ) : (
        <p className="max-w-xs truncate">{row.original.title}</p>
      ),
  },
  {
    id: "details",
    header: "Detalhes",
    accessorKey: "details",
    size: 400,
    cell: ({ row }) =>
      isLoading ? (
        <Skeleton className="h-4 w-full" />
      ) : (
        <p className="max-w-lg truncate rounded bg-zinc-200 px-2 py-1 text-sm text-zinc-800">
          {row.original.details ?? "Não informado"}
        </p>
      ),
  },
  {
    id: "actions",
    cell: ({ row }) =>
      isLoading ? (
        <Skeleton className="h-4 w-full" />
      ) : (
        <LogSheet {...row.original} />
      ),
  },
];
