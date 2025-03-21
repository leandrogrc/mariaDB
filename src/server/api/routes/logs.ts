import { and, asc, count, desc, eq } from "drizzle-orm";

import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import * as schema from "@/server/db/schema";
import { z } from "zod";

export const logsRouter = createTRPCRouter({
  getLogs: adminProcedure
    .input(
      z
        .object({
          sort: z.enum(["asc", "desc"]).default("desc"),
          userId: z.number().optional(),
          page: z.number().default(1),
          limit: z.number().default(10),
        })
        .transform(({ page, limit, ...rest }) => ({
          ...rest,
          limit,
          offset: limit * (page - 1),
        })),
    )
    .query(async ({ ctx, input }) => {
      const filters = [];
      if (input.userId) {
        filters.push(eq(schema.logsTable.userId, input.userId));
      }

      const orderBy = input.sort === "desc" ? desc : asc;

      const [total] = await ctx.db
        .select({ count: count() })
        .from(schema.logsTable)
        .where(and(...filters));

      const logs = await ctx.db
        .select({
          id: schema.logsTable.id,
          title: schema.logsTable.title,
          details: schema.logsTable.details,
          type: schema.logsTable.type,
          userId: schema.logsTable.userId,
          username: schema.usersTable.username,
          stack: schema.logsTable.stack,
          createdAt: schema.logsTable.createdAt,
        })
        .from(schema.logsTable)
        .leftJoin(
          schema.usersTable,
          eq(schema.logsTable.userId, schema.usersTable.id),
        )
        .where(and(...filters))
        .orderBy(orderBy(schema.logsTable.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return {
        data: logs,
        total: total?.count ?? 0,
        rowCount: logs.length,
        hasMore: logs.length + input.offset < (total?.count ?? 0),
      };
    }),
});
