const { eq } = require("drizzle-orm");

const { db } = require("./");
const { linksTable } = require("./schema");

exports.getAllLinks = async function () {
  try {
    const links = await db.select().from(linksTable);
    return { success: true, response: links };
  } catch (error) {
    return { success: false, error: error.message };
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

exports.addLink = async function ({ userId, link, title }) {
  try {
    const { id } = await db
      .insert(linksTable)
      .values({
        link,
        title,
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
