const {
  createLink,
  delLink,
  getAllLinks,
  getLinkById,
  updateLinkById,
} = require("../db/links");

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

const getCreateLinkPage = async (req, res) => {
  return res.status(200).render("create-link");
};

const postLink = async (req, res) => {
  const userId = req.user.id;
  const { title, link, visible = false } = req.body;

  if (!userId || !link || !title) {
    return res.status(400).render("error");
  }

  try {
    const result = await createLink({
      userId,
      link,
      title,
      visible: visible === "on",
    });
    if (result.success) {
      return res.status(200).redirect("/account");
    }

    return res.status(400).render("error");
  } catch (err) {
    console.error(err);
    return res.status(500).render("error");
  }
};

const getUpdateLinkPage = async (req, res) => {
  try {
    const linkExists = await getLinkById(req.params.id);

    if (linkExists.success && linkExists.data?.userId === req.user.id) {
      return res.status(200).render("edit-link", { link: linkExists.data });
    }

    return res.status(400).render("not-found");
  } catch (error) {
    return res.status(500).render("error");
  }
};

const updateLink = async (req, res) => {
  try {
    const { title, link, visible = false } = req.body;
    const linkExists = await getLinkById(req.params.id);

    if (linkExists.success && linkExists.data?.userId === req.user.id) {
      await updateLinkById(req.params.id, {
        title,
        link,
        visible: visible === "on",
      });

      return res.status(200).redirect("/account");
    }

    return res.status(400).render("error");
  } catch (err) {
    console.error(err);
    return res.status(500).render("error");
  }
};

const deleteLink = async (req, res) => {
  try {
    const linkExists = await getLinkById(req.params.id);

    if (linkExists.success && linkExists.data?.userId === req.user.id) {
      await delLink(req.params.id);
      return res.status(200).redirect("/account");
    }

    return res.status(400).render("error");
  } catch (err) {
    console.error(err);
    return res.status(500).render("error");
  }
};

module.exports = {
  getLinks,
  getCreateLinkPage,
  postLink,
  getUpdateLinkPage,
  updateLink,
  deleteLink,
};
