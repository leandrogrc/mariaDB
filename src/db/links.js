const { eq, and, count, desc } = require("drizzle-orm");

const { db } = require(".");
const { linksTable } = require("./schema");

exports.getAllLinks = async function () {
  try {
    const links = await db
      .select({ visible: linksTable.visible, count: count() })
      .from(linksTable)
      .groupBy(linksTable.visible);

    const visibleLinks = links.find(({ visible }) => visible)?.count ?? 0;
    const invisibleLinks = links.find(({ visible }) => !visible)?.count ?? 0;

    return { success: true, visibleLinks, invisibleLinks };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      visibleLinks: 0,
      invisibleLinks: 0,
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
          ? and(eq(linksTable.userId, userId), eq(linksTable.visible, true))
          : eq(linksTable.userId, userId)
      )
      .orderBy(desc(linksTable.visible), desc(linksTable.createdAt));

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

exports.createLink = async function ({ userId, link, title, visible = false }) {
  try {
    const { id } = await db
      .insert(linksTable)
      .values({
        link,
        title,
        visible,
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
  { title, link, visible = false }
) {
  try {
    await db
      .update(linksTable)
      .set({
        title,
        link,
        visible,
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
