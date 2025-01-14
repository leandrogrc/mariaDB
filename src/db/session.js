const cyrpto = require("node:crypto");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const { eq } = require("drizzle-orm");

const { db } = require(".");
const { sessionsTable, usersTable } = require("./schema");

exports.createSession = async function (userId) {
  try {
    const sessionId = cyrpto.randomUUID();
    const expiresAt = dayjs().utc().add(1, "hour");

    await db.insert(sessionsTable).values({
      id: sessionId,
      userId,
      expiresAt,
    });

    return { success: true, result: sessionId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.validateSession = async function (sessionId) {
  try {
    const now = dayjs().utc();

    const [session] = await db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.id, sessionId))
      .limit(1);

    if (!session || now.isAfter(session.expiresAt)) {
      return { success: false, error: "Session expired or not found" };
    }

    const [user] = await db
      .select({
        id: usersTable.id,
        username: usersTable.username,
      })
      .from(usersTable)
      .where(eq(usersTable.id, session.userId))
      .limit(1);

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    return { success: true, result: user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
