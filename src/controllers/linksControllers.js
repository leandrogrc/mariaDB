const {
  createLink,
  delLink,
  getLinkById,
  updateLinkById,
} = require("../db/links");

const getCreateLinkPage = async (req, res) => {
  const csrf = req.csrf();
  return res.status(200).render("create-link", { csrf });
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
      const csrf = req.csrf();
      return res
        .status(200)
        .render("edit-link", { link: linkExists.data, csrf });
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
  getCreateLinkPage,
  postLink,
  getUpdateLinkPage,
  updateLink,
  deleteLink,
};
