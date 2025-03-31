import { z } from "zod";
import { and, eq } from "drizzle-orm";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import * as schema from "@/server/db/schema";

export const userRouter = createTRPCRouter({
  getEmailConfirmationCode: protectedProcedure
    .input(z.object({ confirmationCode: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [user] = await ctx.db
        .select()
        .from(schema.usersTable)
        .where(
          and(
            eq(schema.usersTable.id, ctx.session.user.id),
            eq(schema.usersTable.confirmationCode, input.confirmationCode),
          ),
        );

      if (user?.id && !user?.confirmedAt) {
        const confirmedAt = new Date();
        await ctx.db.insert(schema.logsTable).values({
          title: "Validação de e-mail realizada com sucesso",
          details: JSON.stringify({ confirmedAt }),
          userId: ctx.session.user.id,
          type: "log",
        });

        await ctx.db
          .update(schema.usersTable)
          .set({ confirmedAt })
          .where(
            eq(schema.usersTable.confirmationCode, input.confirmationCode),
          );
      }

      return {
        id: user?.id,
        confirmationAt: user?.confirmedAt,
      };
    }),
  getMe: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await ctx.db
      .select({
        id: schema.usersTable.id,
        name: schema.usersTable.name,
        email: schema.usersTable.email,
        confirmedAt: schema.usersTable.confirmedAt,
        photoUrl: schema.usersTable.photoUrl,
        description: schema.usersTable.description,
        type: schema.usersTable.type,
        username: schema.usersTable.username,
      })
      .from(schema.usersTable)
      .where(eq(schema.usersTable.id, ctx.session.user.id))
      .limit(1);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return user;
  }),
  getById: adminProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ ctx, input }) => {
      const [user] = await ctx.db
        .select({
          id: schema.usersTable.id,
          name: schema.usersTable.name,
          email: schema.usersTable.email,
          username: schema.usersTable.username,
          photoUrl: schema.usersTable.photoUrl,
          description: schema.usersTable.description,
        })
        .from(schema.usersTable)
        .where(eq(schema.usersTable.id, input.userId));

      return user ?? null;
    }),
  getByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const [user] = await ctx.db
        .select({
          id: schema.usersTable.id,
          name: schema.usersTable.name,
          email: schema.usersTable.email,
          username: schema.usersTable.username,
          type: schema.usersTable.type,
          description: schema.usersTable.description,
          photoUrl: schema.usersTable.photoUrl,
        })
        .from(schema.usersTable)
        .where(eq(schema.usersTable.username, input.username))
        .limit(1);

      if (!user?.id) {
        return { user: null, links: null };
      }

      const links = await ctx.db
        .select()
        .from(schema.linksTable)
        .where(
          and(
            eq(schema.linksTable.userId, user.id),
            eq(schema.linksTable.active, true),
          ),
        );

      return { user, links };
    }),
  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.string().max(50),
        photoUrl: z.string().url().max(500).nullable(),
        description: z.string().max(50).nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db
          .update(schema.usersTable)
          .set({
            name: input.name,
            photoUrl: input.photoUrl,
            description: input.description,
          })
          .where(eq(schema.usersTable.id, ctx.session.user.id))
          .limit(1);

        await ctx.db.insert(schema.logsTable).values({
          title: "Usuário atualizado com sucesso",
          details: JSON.stringify(input),
          userId: ctx.session.user.id,
          type: "log",
        });
      } catch (error: Error | any) {
        await ctx.db.insert(schema.logsTable).values({
          title: "Não foi possível atualiza usuário",
          details: JSON.stringify(input),
          userId: ctx.session.user.id,
          stack: error?.stack,
          type: "error",
        });

        throw error;
      }
    }),
});
