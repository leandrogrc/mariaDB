"use client";

import { api } from "@/trpc/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { getColumns, type LogItem } from "./columns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../_components/ui/table";
import { classnames } from "@/utils/classnames";
import { ChevronLeft, ChevronRight, X } from "react-feather";
import { z } from "zod";

const skeletonData: LogItem[] = [
  {
    id: 0,
    title: "",
    details: "",
    type: "log",
    userId: 0,
    username: "",
    stack: "",
    createdAt: new Date(),
  },
];

const LIMIT = 10;
const filterSchema = z.object({ userId: z.coerce.number().nullable() });

export function LogsList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "createdAt",
      desc: true,
    },
  ]);

  const filters = filterSchema.safeParse({
    userId: searchParams.get("userId"),
  });

  const { data: logs, isLoading } = api.log.getLogs.useQuery({
    page,
    sort: sorting[0]?.desc ? "desc" : "asc",
    userId: filters.data?.userId || undefined,
    limit: LIMIT,
  });

  const columns = useMemo(
    () => getColumns({ isLoading, onSelectUser }),
    [logs?.data, isLoading],
  );

  const table = useReactTable({
    data: isLoading ? skeletonData : (logs?.data ?? []),
    columns,
    manualPagination: true,
    rowCount: logs?.rowCount,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  function onSelectUser(userId: number) {
    router.push(`/admin/logs?userId=${userId}`);
  }

  function clearFilter() {
    router.push("/admin/logs");
  }

  const canGoPrevious = page > 1;
  const canGoNext = logs?.hasMore || false;

  return (
    <section className="rounded border border-zinc-300 bg-white p-4">
      <h1 className="mb-6 text-xl font-medium text-black">Logs</h1>
      {filters.data?.userId ? (
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-8 w-fit items-center text-sm">
            <span className="flex h-full items-center rounded-l border-t border-b border-l border-orange-400 bg-orange-400 px-2 py-1 text-white">
              Id do usuário
            </span>
            <span className="flex h-full items-center rounded-r border-t border-r border-b border-zinc-300 px-2 py-1">
              {filters.data.userId}
            </span>
          </div>
          <button
            className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 transition hover:bg-zinc-200"
            onClick={clearFilter}
          >
            <span>Limpar</span>
            <X className="inline-block h-4 w-4" />
          </button>
        </div>
      ) : null}
      <div className="rounded border">
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
                  Sem logs
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-zinc-600">
          {logs?.rowCount} de {logs?.total} log(s)
        </div>
        <div className="flex gap-4">
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
