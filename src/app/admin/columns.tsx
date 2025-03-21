import { ColumnDef } from "@tanstack/react-table";
import { Skeleton } from "../_components/ui/skeleton";
import { UserItemActions } from "./UserItemActions";

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
        <UserItemActions user={row.original} />
      ),
  },
];
