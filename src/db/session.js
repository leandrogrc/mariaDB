const cyrpto = require("node:crypto");
const { db } = require(".");
const { sessionsTable } = require("./schema");

exports.createSession = async function (userId) {
  try {
    const sessionId = cyrpto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

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
