"use client";

import { z } from "zod";
import { api } from "@/trpc/react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "react-feather";

import { classnames } from "@/utils/classnames";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../_components/ui/table";
import { getColumns } from "./columns";

interface UserItem {
  id: number;
  username: string;
  name: string;
  description: string | null;
  photoUrl: string | null;
  type: "admin" | "user";
  links: number;
}

const skeletonData: UserItem[] = [
  {
    id: 0,
    name: "",
    username: "",
    description: null,
    photoUrl: null,
    type: "user",
    links: 0,
  },
];

const LIMIT = 10;

const filterSchema = z.object({
  name: z.string().optional(),
  username: z.string().optional(),
});

type FilterSchema = z.infer<typeof filterSchema>;

export function UsersList() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterSchema>({
    name: undefined,
    username: undefined,
  });

  const { data: users, isLoading } = api.admin.getUsers.useQuery({
    name: filters.name,
    username: filters.username,
    page,
    limit: LIMIT,
  });

  const columns = useMemo<ColumnDef<UserItem>[]>(
    () => getColumns(isLoading),
    [users?.data, isLoading],
  );

  const table = useReactTable({
    data: isLoading ? skeletonData : (users?.data ?? []),
    columns,
    manualPagination: true,
    rowCount: users?.rowCount,
    getCoreRowModel: getCoreRowModel(),
  });

  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(filterSchema),
  });

  function onSubmit(data: FilterSchema) {
    setPage(1);
    setFilters({
      name: data.name || undefined,
      username: data.username || undefined,
    });
  }

  function clearFilters() {
    reset();
    setPage(1);
    setFilters({
      name: undefined,
      username: undefined,
    });
  }

  const canGoPrevious = page > 1;
  const canGoNext = users?.hasMore || false;

  return (
    <section className="rounded border border-zinc-300 bg-white p-4">
      <h1 className="mb-6 text-xl font-medium text-black">Lista de usuários</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-12">
        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-3">
          <fieldset className="flex w-full flex-col items-start">
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-zinc-600"
            >
              Nome
            </label>
            <input
              type="text"
              id="name"
              maxLength={25}
              {...register("name")}
              className="w-full rounded border border-zinc-300 px-4 py-2 text-zinc-800 outline-indigo-500"
            />
          </fieldset>
          <fieldset className="flex w-full flex-col items-start">
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium text-zinc-600"
            >
              Usuário
            </label>
            <input
              type="text"
              id="username"
              maxLength={25}
              {...register("username")}
              className="w-full rounded border border-zinc-300 px-4 py-2 text-zinc-800 outline-indigo-500"
            />
          </fieldset>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={clearFilters}
              className="w-42 cursor-pointer rounded border border-zinc-400 py-2 text-center text-zinc-600"
            >
              Limpar
            </button>
            <button
              type="submit"
              className="w-42 cursor-pointer rounded bg-indigo-500 py-2 text-center text-white transition hover:bg-indigo-800"
            >
              Buscar
            </button>
          </div>
        </div>
      </form>
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sem usuários
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 px-4 text-sm text-zinc-600">
          {users?.rowCount} de {users?.total} usuário(s)
        </div>
        <div className="flex gap-4 px-4">
          <button
            onClick={() => setPage((page) => page - 1)}
            disabled={!canGoPrevious}
            className={classnames({
              "flex h-9 w-9 items-center justify-center rounded border bg-transparent text-sm font-medium transition":
                true,
              "cursor-pointer border-zinc-400 text-zinc-800 hover:bg-zinc-100":
                canGoPrevious,
              "cursor-not-allowed border-zinc-200 text-zinc-400":
                !canGoPrevious,
            })}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setPage((page) => page + 1)}
            disabled={!canGoNext}
            className={classnames({
              "flex h-9 w-9 items-center justify-center rounded border bg-transparent text-sm font-medium transition":
                true,
              "cursor-pointer border-zinc-400 text-zinc-800 hover:bg-zinc-100":
                canGoNext,
              "cursor-not-allowed border-zinc-200 text-zinc-400": !canGoNext,
            })}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
