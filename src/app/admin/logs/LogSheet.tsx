import { Eye } from "react-feather";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet";
import { classnames } from "@/utils/classnames";

interface LogSheetProps {
  id: number;
  title: string;
  details: string | null;
  type: "log" | "error";
  username: string | null;
  userId: number | null;
  stack: string | null;
  createdAt: Date;
}

export function LogSheet({
  title,
  details,
  type,
  userId,
  username,
  stack,
  createdAt,
}: LogSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="mx-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded transition hover:bg-zinc-100">
          <Eye className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[640px]">
        <SheetHeader>
          <SheetTitle>Detalhes de log</SheetTitle>
          <SheetDescription className="flex items-center gap-2">
            <span
              className={classnames({
                "rounded px-2 py-1": true,
                "bg-orange-400 text-white": type === "log",
                "bg-red-500 text-white": type === "error",
              })}
            >
              {type}
            </span>
            <small className="text-sm text-zinc-600">
              {createdAt.toLocaleString()}
            </small>
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4">
          <div className="flex w-full flex-col items-start">
            <small className="mb-1 block text-sm font-medium text-zinc-600">
              Título
            </small>
            <p className="w-full rounded border border-zinc-300 px-4 py-2 text-zinc-800">
              {title}
            </p>
          </div>
          {userId ? (
            <div className="flex w-full flex-col items-start">
              <small className="mb-1 block text-sm font-medium text-zinc-600">
                Usuário
              </small>
              <p className="w-full rounded border border-zinc-300 px-4 py-2 text-zinc-800">
                {username}
              </p>
            </div>
          ) : null}
          {details ? (
            <div className="flex w-full flex-col items-start">
              <small className="mb-1 block text-sm font-medium text-zinc-600">
                Detalhes
              </small>
              <div className="w-full overflow-auto rounded bg-zinc-200 p-4 text-sm text-zinc-800">
                <code>
                  <pre>{JSON.stringify(JSON.parse(details), null, 2)}</pre>
                </code>
              </div>
            </div>
          ) : null}
          {stack ? (
            <div className="flex w-full flex-col items-start">
              <small className="mb-1 block text-sm font-medium text-zinc-600">
                Stack
              </small>
              <div className="w-full overflow-auto rounded bg-zinc-200 p-4 text-sm text-zinc-800">
                <code>
                  <pre>{stack}</pre>
                </code>
              </div>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
