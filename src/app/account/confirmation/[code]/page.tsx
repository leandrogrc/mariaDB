"use server";
import { z } from "zod";

import { api } from "@/trpc/server";

import ConfirmationNotFound from "./ConfirmationNotFound";
import ConfirmedAccount from "./ConfirmedAccount";

const paramsSchema = z.object({ code: z.string().uuid() });

export default async function EmailConfirmationCode(props: {
  params: Promise<{ code: string }>;
}) {
  const params = await props.params;
  const input = paramsSchema.safeParse(params);

  if (input.error) {
    return <ConfirmationNotFound />;
  }

  const user = await api.user.getEmailConfirmationCode({
    confirmationCode: input.data.code,
  });

  if (!user?.id) {
    return <ConfirmationNotFound />;
  }

  return <ConfirmedAccount />;
}
