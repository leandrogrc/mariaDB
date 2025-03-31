import { z } from "zod";
import { count, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import * as schema from "@/server/db/schema";

const hashSalt = 10;

export const authRouter = createTRPCRouter({
  hasAdmin: publicProcedure.query(async ({ ctx }) => {
    const [admins] = await ctx.db
      .select({ count: count() })
      .from(schema.usersTable)
      .where(eq(schema.usersTable.type, "admin"))
      .limit(1);

    return (admins?.count ?? 0) > 0;
  }),
  addAdim: adminProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        username: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [usernameAlreadyExists] = await ctx.db
        .select({ id: schema.usersTable.id })
        .from(schema.usersTable)
        .where(eq(schema.usersTable.username, input.username))
        .limit(1);

      if (usernameAlreadyExists) {
        throw new Error("Usuário já cadastrado");
      }

      const [emailAlreadyExists] = await ctx.db
        .select({ id: schema.usersTable.id })
        .from(schema.usersTable)
        .where(eq(schema.usersTable.username, input.username))
        .limit(1);

      if (emailAlreadyExists) {
        throw new Error("E-mail já cadastrado");
      }

      try {
        const confirmationCode = randomUUID();
        const cryptPassword = await bcrypt.hash(input.password, hashSalt);
        const [newAdmin] = await ctx.db
          .insert(schema.usersTable)
          .values({
            name: input.name,
            username: input.username,
            confirmationCode,
            email: input.email,
            password: cryptPassword,
            type: "admin",
          })
          .$returningId();

        await ctx.db.insert(schema.logsTable).values({
          title: "Administrador criado",
          details: JSON.stringify({
            id: newAdmin?.id,
            name: input.name,
            username: input.username,
            type: "admin",
          }),
          userId: newAdmin?.id,
          type: "log",
        });
      } catch (error: Error | any) {
        await ctx.db.insert(schema.logsTable).values({
          title: "Administrador criado",
          details: JSON.stringify({
            name: input.name,
            username: input.username,
            type: "admin",
          }),
          stack: error?.stack,
          type: "error",
        });

        throw error;
      }
    }),
  register: publicProcedure
    .input(
      z.object({
        type: z.enum(["admin", "user"]).default("user"),
        name: z.string(),
        email: z.string().email(),
        username: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.type === "admin") {
        const [admins] = await ctx.db
          .select({ count: count() })
          .from(schema.usersTable)
          .where(eq(schema.usersTable.type, "admin"))
          .limit(1);

        if ((admins?.count ?? 0) > 0) {
          throw new Error("Não é possível criar um administrador");
        }
      }

      const [usernameAlreadyExists] = await ctx.db
        .select({ id: schema.usersTable.id })
        .from(schema.usersTable)
        .where(eq(schema.usersTable.username, input.username))
        .limit(1);

      if (usernameAlreadyExists) {
        throw new Error("Usuário já cadastrado");
      }

      const [emailAlreadyExists] = await ctx.db
        .select({ id: schema.usersTable.id })
        .from(schema.usersTable)
        .where(eq(schema.usersTable.username, input.username))
        .limit(1);

      if (emailAlreadyExists) {
        throw new Error("E-mail já cadastrado");
      }

      try {
        const confirmationCode = randomUUID();
        const cryptPassword = await bcrypt.hash(input.password, hashSalt);
        const [newUser] = await ctx.db
          .insert(schema.usersTable)
          .values({
            name: input.name,
            username: input.username,
            confirmationCode,
            email: input.email,
            password: cryptPassword,
            type: input.type,
          })
          .$returningId();

        await ctx.db.insert(schema.logsTable).values({
          title: "Usuário criado",
          details: JSON.stringify({
            id: newUser?.id,
            name: input.name,
            username: input.username,
          }),
          userId: newUser?.id,
          type: "log",
        });
      } catch (error: Error | any) {
        await ctx.db.insert(schema.logsTable).values({
          title: "Não foi possível criar conta",
          details: JSON.stringify({
            name: input.name,
            username: input.username,
            type: input.type,
          }),
          stack: error?.stack,
          type: "error",
        });

        throw error;
      }
    }),
});
