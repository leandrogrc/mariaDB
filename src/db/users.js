const { eq } = require("drizzle-orm");

const { db } = require(".");
const { usersTable, linksTable } = require("./schema");

exports.getAllUsers = async function () {
  try {
    const users = await db
      .select({
        id: usersTable.id,
        username: usersTable.username,
      })
      .from(usersTable);

    return { success: true, users };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, error: err.message };
  }
};

exports.getUserByName = async function (username) {
  try {
    const [user] = await db
      .select({
        id: usersTable.id,
        username: usersTable.username,
        password: usersTable.password,
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

exports.createUser = async function ({ username, password }) {
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
        username,
        password,
      })
      .$returningId();

    const [newUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    return { success: true, result: newUser };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, error: err.message };
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
