"use client";

import { api } from "@/trpc/react";
import { LinkField } from "./LinkField";
import { Link } from "@/server/db/schema";

interface LinksListProps {
  links: Link[];
}

export function LinksList({ links }: LinksListProps) {
  const getLinks = api.link.getLinks.useQuery(undefined, {
    initialData: links,
  });

  function onDelete() {
    getLinks.refetch();
  }

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {getLinks?.data?.map((link) => (
        <LinkField key={link.id} {...link} onDelete={onDelete} />
      ))}
    </section>
  );
}
