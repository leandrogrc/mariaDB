const { eq, count, sql, desc, like, and } = require("drizzle-orm");

const { db } = require(".");
const { usersTable, linksTable } = require("./schema");

exports.hasAdmin = async function () {
  try {
    const [{ admins }] = await db
      .select({
        admins: count(),
      })
      .from(usersTable)
      .where(eq(usersTable.type, "admin"))
      .limit(1);

    return { success: true, result: admins > 0 };
  } catch (error) {
    return { success: false, result: false };
  }
};

exports.getUsersStats = async function () {
  try {
    const rows = await db
      .select({
        type: usersTable.type,
        count: count(),
      })
      .from(usersTable)
      .groupBy(usersTable.type);

    const users = rows.find(({ type }) => type === "user")?.count ?? 0;
    const admins = rows.find(({ type }) => type === "admin")?.count ?? 0;

    return { success: true, users, admins };
  } catch (error) {
    return { success: false, users: 0, admins: 0 };
  }
};

exports.getAllUsers = async function ({
  name = undefined,
  username = undefined,
  page = 1,
  limit = 20,
} = {}) {
  try {
    const filters = [];
    filters.push(eq(usersTable.type, "user"));

    if (name) {
      filters.push(like(usersTable.name, `%${name.toLowerCase()}%`));
    }

    if (username) {
      filters.push(like(usersTable.username, `%${username.toLowerCase()}%`));
    }

    const users = await db
      .select({
        id: usersTable.id,
        username: usersTable.username,
        name: usersTable.name,
        photoUrl: usersTable.photoUrl,
        links: sql`(${db
          .select({ count: count() })
          .from(linksTable)
          .where(eq(linksTable.userId, usersTable.id))})`.mapWith(Number),
      })
      .from(usersTable)
      .where(and(...filters))
      .orderBy(desc(usersTable.createdAt))
      .limit(limit);

    return { success: true, users };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, error: err.message, users: [] };
  }
};

exports.getUserByUsername = async function (username, showPassword = false) {
  try {
    const [user] = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        username: usersTable.username,
        type: usersTable.type,
        ...(showPassword
          ? {
              password: usersTable.password,
            }
          : {}),
        description: usersTable.description,
        photoUrl: usersTable.photoUrl,
      })
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    return { success: true, response: user };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, error: err.message };
  }
};

exports.getUserLinks = async function (username) {
  try {
    const [user] = await db
      .select({
        id: usersTable.id,
        username: usersTable.username,
      })
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const links = await db
      .select()
      .from(linksTable)
      .where(eq(linksTable.userId, user.id));

    return { success: true, response: { ...user, links } };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, error: err.message };
  }
};

exports.createUser = async function ({
  name,
  type = "user",
  username,
  password,
  photoUrl = null,
  description = null,
}) {
  try {
    const [userAlreadyExists] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);

    if (userAlreadyExists) {
      return {
        success: false,
        error: "User already exists! Try another username",
      };
    }

    const [{ id }] = await db
      .insert(usersTable)
      .values({
        name,
        username,
        password,
        type,
        photoUrl,
        description,
      })
      .$returningId();

    const [newUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    return { success: true, response: newUser };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, error: err.message };
  }
};

exports.updateUserById = async function (
  userId,
  { name, photoUrl = null, description = null }
) {
  try {
    await db
      .update(usersTable)
      .set({
        name,
        photoUrl,
        description,
      })
      .where(eq(usersTable.id, userId))
      .limit(1);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
};

exports.deleteUserByUsername = async function (username) {
  try {
    const [result] = await db
      .delete(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);

    return { success: true, usersDeleted: result.affectedRows };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, error: err.message };
  }
};
