import { and, count, desc, eq, like, or, sql } from "drizzle-orm";

import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import * as schema from "@/server/db/schema";
import { z } from "zod";

export const adminRouter = createTRPCRouter({
  changeUserType: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        type: z.enum(["admin", "user"]).default("user"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (
        input.userId === Number(ctx.session.user.id) &&
        input.type === "user"
      ) {
        return;
      }

      await ctx.db
        .update(schema.usersTable)
        .set({
          type: input.type,
        })
        .where(eq(schema.usersTable.id, input.userId));
    }),
  getStats: adminProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select({
        type: schema.usersTable.type,
        count: count(),
      })
      .from(schema.usersTable)
      .groupBy(schema.usersTable.type);

    const links = await ctx.db
      .select({ active: schema.linksTable.active, count: count() })
      .from(schema.linksTable)
      .groupBy(schema.linksTable.active);

    const activeLinks = links.find(({ active }) => active)?.count ?? 0;
    const inactiveLinks = links.find(({ active }) => !active)?.count ?? 0;

    const users = rows.find(({ type }) => type === "user")?.count ?? 0;
    const admins = rows.find(({ type }) => type === "admin")?.count ?? 0;

    return { users, admins, activeLinks, inactiveLinks };
  }),
  getUsers: adminProcedure
    .input(
      z
        .object({
          name: z.string().optional(),
          username: z.string().optional(),
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
      if (input.name) {
        filters.push(
          like(schema.usersTable.name, `%${input.name.toLowerCase()}%`),
        );
      }

      if (input.username) {
        filters.push(
          like(schema.usersTable.username, `%${input.username.toLowerCase()}%`),
        );
      }

      const [total] = await ctx.db
        .select({ count: count() })
        .from(schema.usersTable)
        .where(and(...filters));

      const users = await ctx.db
        .select({
          id: schema.usersTable.id,
          username: schema.usersTable.username,
          name: schema.usersTable.name,
          description: schema.usersTable.description,
          photoUrl: schema.usersTable.photoUrl,
          type: schema.usersTable.type,
          links: sql`(${ctx.db
            .select({ count: count() })
            .from(schema.linksTable)
            .where(
              eq(schema.linksTable.userId, schema.usersTable.id),
            )})`.mapWith(Number),
        })
        .from(schema.usersTable)
        .where(and(...filters))
        .orderBy(desc(schema.usersTable.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return {
        data: users,
        total: total?.count ?? 0,
        rowCount: users.length,
        hasMore: users.length + input.offset < (total?.count ?? 0),
      };
    }),
  getEmailConfig: adminProcedure.query(async ({ ctx }) => {
    const settings = await ctx.db
      .select()
      .from(schema.settingsTable)
      .where(
        or(
          eq(schema.settingsTable.key, "smtp_host"),
          eq(schema.settingsTable.key, "smtp_port"),
          eq(schema.settingsTable.key, "smtp_user"),
          eq(schema.settingsTable.key, "smtp_pass"),
          eq(schema.settingsTable.key, "smtp_secure"),
        ),
      );

    const smtpHost = settings.find(({ key }) => key === "smtp_host")?.value;
    const smtpPort = settings.find(({ key }) => key === "smtp_port")?.value;
    const smtpUser = settings.find(({ key }) => key === "smtp_user")?.value;
    const smtpPass = settings.find(({ key }) => key === "smtp_pass")?.value;
    const smtpSecure = settings.find(({ key }) => key === "smtp_secure")?.value;

    return {
      smtpHost: smtpHost ?? null,
      smtpPort: smtpPort ?? null,
      smtpUser: smtpUser ?? null,
      smtpPass: smtpPass ?? null,
      smtpSecure: smtpSecure ? smtpSecure === "true" : false,
    };
  }),
  saveEmailConfig: adminProcedure
    .input(
      z.object({
        smtpHost: z.string(),
        smtpPort: z.string(),
        smtpUser: z.string(),
        smtpPass: z.string(),
        smtpSecure: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(schema.settingsTable);
      await ctx.db.insert(schema.settingsTable).values([
        { key: "smtp_host", value: input.smtpHost },
        { key: "smtp_port", value: input.smtpPort },
        { key: "smtp_user", value: input.smtpUser },
        { key: "smtp_pass", value: input.smtpPass },
        { key: "smtp_secure", value: input.smtpSecure ? "true" : "false" },
      ]);
    }),
});
