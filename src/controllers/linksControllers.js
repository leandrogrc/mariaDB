const { addLink, delLink, getAllLinks, getLinkById } = require("../db/links");

// GET all links
const getLinks = async (req, res) => {
  try {
    const result = await getAllLinks();
    res.status(200).json({ response: result.response });
  } catch (err) {
    console.error("Error in getLinks:", err);
    return res.status(500).json({ error: "Failed to fetch links" });
  }
};

// POST new link
const postLink = async (req, res) => {
  const userId = req.user.id;
  const { link, title } = req.body;

  // Validate the presence of userId and link
  if (!userId || !link || !title) {
    return res.status(400).json({ error: "link and title are required" });
  }

  try {
    // Add link to the user
    const result = await addLink({ userId, link, title });

    if (result.success) {
      return res.status(200).json({
        message: "Link added successfully",
        insertId: result.insertId,
      });
    } else {
      // In case there is an issue with the query (no rows affected, etc.)
      return res.status(500).json({
        error: "Failed to add link",
        details: result.message || result.error,
      });
    }
  } catch (err) {
    console.error("Error in postLink:", err);
    return res.status(500).json({ error: "Failed to add link" });
  }
};

// GET single link
const getSingleLink = async (req, res) => {
  try {
    const result = await getLinkById(req.params.id);
    res.status(200).json({ data: result.data, message: result.message });
  } catch (err) {
    console.error("Error in getLinks:", err);
    return res.status(500).json({ error: "Failed to fetch links" });
  }
};

// PUT a link
// TODO: update link
const updateLink = (req, res) => res.json("PUT link ID = " + req.params.id);

// DELETE a link
const deleteLink = async (req, res) => {
  try {
    const result = await delLink(req.params.id);
    res.status(200).json({ data: result.data, message: result.message });
  } catch (err) {
    console.error("Error in getLinks:", err);
    return res.status(500).json({ error: "Failed to fetch links" });
  }
};

module.exports = {
  getSingleLink,
  getLinks,
  postLink,
  updateLink,
  deleteLink,
};
