"use client";

import { Shield, Users, ExternalLink, EyeOff } from "react-feather";

interface AdminStatsProps {
  users: number;
  admins: number;
  activeLinks: number;
  inactiveLinks: number;
}

export function AdminStats({
  users,
  admins,
  activeLinks,
  inactiveLinks,
}: AdminStatsProps) {
  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <article className="relative flex items-center justify-between rounded border border-zinc-300 bg-white p-4 text-center">
        <div className="text-left">
          <small className="text-sm font-light uppercase">Admins</small>
          <h2 className="text-3xl font-medium">{admins}</h2>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-200">
          <Shield className="h-5 w-5 text-sky-800" />
        </div>
      </article>
      <article className="relative flex items-center justify-between rounded border border-zinc-300 bg-white p-4 text-center">
        <div className="text-left">
          <small className="text-sm font-light uppercase">Usuários</small>
          <h2 className="text-3xl font-medium">{users}</h2>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-200">
          <Users className="h-5 w-5 text-orange-800" />
        </div>
      </article>
      <article className="flex items-center justify-between rounded border border-zinc-300 bg-white p-4 text-center">
        <div className="text-left">
          <small className="text-sm font-light uppercase">Links Ativos</small>
          <h2 className="text-3xl font-medium">{activeLinks}</h2>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-200">
          <ExternalLink className="h-5 w-5 text-indigo-800" />
        </div>
      </article>
      <article className="flex items-center justify-between rounded border border-zinc-300 bg-white p-4 text-center">
        <div className="text-left">
          <small className="text-sm font-light uppercase">Links Inativos</small>
          <h2 className="text-3xl font-medium">{inactiveLinks}</h2>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-200">
          <EyeOff className="h-5 w-5 text-red-800" />
        </div>
      </article>
    </section>
  );
}
