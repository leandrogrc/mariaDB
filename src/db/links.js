const { eq, and, count, desc } = require("drizzle-orm");

const { db } = require(".");
const { linksTable } = require("./schema");

exports.getAllLinks = async function () {
  try {
    const links = await db
      .select({ active: linksTable.active, count: count() })
      .from(linksTable)
      .groupBy(linksTable.active);

    const activeLinks = links.find(({ active }) => active)?.count ?? 0;
    const inactiveLinks = links.find(({ active }) => !active)?.count ?? 0;

    return { success: true, activeLinks, inactiveLinks };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      activeLinks: 0,
      inactiveLinks: 0,
    };
  }
};

exports.getLinksByUserId = async function (userId, getActiveLinks = false) {
  try {
    const links = await db
      .select()
      .from(linksTable)
      .where(
        getActiveLinks
          ? and(eq(linksTable.userId, userId), eq(linksTable.active, true))
          : eq(linksTable.userId, userId)
      )
      .orderBy(desc(linksTable.active), desc(linksTable.createdAt));

    return { success: true, data: links };
  } catch (error) {
    console.error(error);
    return { success: false, data: [] };
  }
};

exports.getLinkById = async function (linkId) {
  try {
    const [link] = await db
      .select()
      .from(linksTable)
      .where(eq(linksTable.id, linkId))
      .limit(1);

    if (!link) {
      return { success: true, data: null, message: "not exist" };
    }

    return { success: true, data: link, message: "Link found" };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, error: err.message };
  }
};

exports.createLink = async function ({ userId, link, title, active = false }) {
  try {
    const { id } = await db
      .insert(linksTable)
      .values({
        link,
        title,
        active,
        userId,
      })
      .$returningId();

    const [newLink] = await db
      .select()
      .from(linksTable)
      .where(eq(linksTable.id, id))
      .limit(1);

    return { success: true, response: newLink };
  } catch (err) {
    console.error("Error adding link to user:", err);
    return { success: false, error: err.message }; // Return error object
  }
};

exports.updateLinkById = async function (
  linkId,
  { title, link, active = false }
) {
  try {
    await db
      .update(linksTable)
      .set({
        title,
        link,
        active,
      })
      .where(eq(linksTable.id, linkId));

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.delLink = async function (linkId) {
  try {
    const [result] = await db
      .delete(linksTable)
      .where(eq(linksTable.id, linkId))
      .limit(1);

    if (result.affectedRows === 0) {
      return { success: true, data: null, message: "not exist" };
    }

    return {
      success: true,
      data: linkId,
      message: "Link found and deleted",
    };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, error: err.message };
  }
};
