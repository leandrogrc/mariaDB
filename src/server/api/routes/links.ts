import { and, desc, eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import * as schema from "@/server/db/schema";
import { z } from "zod";

export const linksRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().max(255),
        link: z.string().url().max(255),
        active: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const [newLink] = await ctx.db
          .insert(schema.linksTable)
          .values({
            link: input.link,
            title: input.title,
            active: input.active,
            userId: ctx.session.user.id,
          })
          .$returningId();

        await ctx.db.insert(schema.logsTable).values({
          title: "Link criado com sucesso",
          details: JSON.stringify({ id: newLink?.id, ...input }),
          userId: ctx.session.user.id,
          type: "log",
        });
      } catch (error: Error | any) {
        await ctx.db.insert(schema.logsTable).values({
          title: "Não foi possível criar link",
          details: JSON.stringify(input),
          userId: ctx.session.user.id,
          stack: error?.stack,
          type: "error",
        });

        throw error;
      }
    }),
  getLinks: protectedProcedure.query(async ({ ctx }) => {
    const links = await ctx.db
      .select()
      .from(schema.linksTable)
      .where(eq(schema.linksTable.userId, ctx.session.user.id))
      .orderBy(
        desc(schema.linksTable.active),
        desc(schema.linksTable.createdAt),
      );

    return links;
  }),
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const [link] = await ctx.db
        .select()
        .from(schema.linksTable)
        .where(
          and(
            eq(schema.linksTable.id, input.id),
            eq(schema.linksTable.userId, ctx.session.user.id),
          ),
        )
        .limit(1);

      return link;
    }),
  updateById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().max(255),
        link: z.string().url().max(255),
        active: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db
          .update(schema.linksTable)
          .set({
            title: input.title,
            link: input.link,
            active: input.active,
          })
          .where(
            and(
              eq(schema.linksTable.id, input.id),
              eq(schema.linksTable.userId, ctx.session.user.id),
            ),
          );

        await ctx.db.insert(schema.logsTable).values({
          title: `Link ${input.id} atualizado com sucesso`,
          details: JSON.stringify(input),
          userId: ctx.session.user.id,
          type: "log",
        });
      } catch (error: Error | any) {
        await ctx.db.insert(schema.logsTable).values({
          title: `Não foi possível atualizar link ${input.id}`,
          details: JSON.stringify(input),
          userId: ctx.session.user.id,
          stack: error?.stack,
          type: "error",
        });

        throw error;
      }
    }),
  deleteById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [link] = await ctx.db
        .select()
        .from(schema.linksTable)
        .where(
          and(
            eq(schema.linksTable.id, input.id),
            eq(schema.linksTable.userId, ctx.session.user.id),
          ),
        )
        .limit(1);

      if (!link) return;

      try {
        await ctx.db
          .delete(schema.linksTable)
          .where(
            and(
              eq(schema.linksTable.id, input.id),
              eq(schema.linksTable.userId, ctx.session.user.id),
            ),
          )
          .limit(1);

        await ctx.db.insert(schema.logsTable).values({
          title: "Link removido com sucesso",
          details: JSON.stringify(link),
          userId: ctx.session.user.id,
          type: "log",
        });
      } catch (error: Error | any) {
        await ctx.db.insert(schema.logsTable).values({
          title: `Não foi possível remover link ${input.id}`,
          details: JSON.stringify(link),
          userId: ctx.session.user.id,
          stack: error?.stack,
          type: "error",
        });

        throw error;
      }
    }),
});
