"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Monitor, Layers, Settings } from "react-feather";

import { classnames } from "@/utils/classnames";

const activeClassname = "text-white bg-indigo-500 hover:bg-indigo-600";
const inactiveClassname = "text-zinc-800 bg-transparent hover:bg-zinc-200";

const availableTabs = new Set(["dashboard", "logs", "settings"]);

export function AdminNavigation() {
  const pathname = usePathname();
  const pathId = pathname.split("/").pop();
  const currentPage = availableTabs.has(pathId || "") ? pathId : "dashboard";

  return (
    <section className="mb-6 rounded border border-zinc-300 bg-white p-2">
      <div className="flex w-full flex-col items-center gap-2 md:w-fit md:flex-row">
        <Link
          href="/admin"
          className={classnames({
            "flex w-full cursor-pointer items-center justify-start rounded px-2 py-2 transition md:w-fit md:justify-center md:px-4":
              true,
            [activeClassname]: currentPage === "dashboard",
            [inactiveClassname]: currentPage !== "dashboard",
          })}
        >
          <Monitor className="mr-2 h-5 w-5" />
          Dashboard
        </Link>
        <Link
          href="/admin/logs"
          className={classnames({
            "flex w-full cursor-pointer items-center justify-start rounded px-2 py-2 transition md:w-fit md:justify-center md:px-4":
              true,
            [activeClassname]: currentPage === "logs",
            [inactiveClassname]: currentPage !== "logs",
          })}
        >
          <Layers className="mr-2 h-5 w-5" />
          Logs do sistema
        </Link>
        <Link
          href="/admin/settings"
          className={classnames({
            "flex w-full cursor-pointer items-center justify-start rounded px-2 py-2 transition md:w-fit md:justify-center md:px-4":
              true,
            [activeClassname]: currentPage === "settings",
            [inactiveClassname]: currentPage !== "settings",
          })}
        >
          <Settings className="mr-2 h-5 w-5" />
          Configurações
        </Link>
      </div>
    </section>
  );
}
