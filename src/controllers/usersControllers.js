const {
  getAllUsers,
  getUserLinks,
  getUserByUsername,
  deleteUserByUsername,
  updateUserById,
} = require("../db/users");
const { getLinksByUserId } = require("../db/links");

exports.getUserPanel = async (req, res) => {
  try {
    if (req.user.type === "admin") {
      return res.status(200).redirect("/admin");
    }

    const csrf = req.csrf();
    const links = await getLinksByUserId(req.user.id);
    return res.render("homepage", {
      user: req.user,
      links: links.data,
      csrf,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).render("error");
  }
};

exports.getUserPage = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await getUserByUsername(username);
    if (!user.response?.id || user.response?.type !== "user") {
      return res.status(400).render("user-not-found", { username });
    }
    const links = await getLinksByUserId(user.response.id, true);

    return res.render("userpage", { user: user.response, links: links.data });
  } catch (error) {
    return res.status(500).send();
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { name = undefined, username = undefined, limit = 10 } = req.query;

    const result = await getAllUsers({
      name,
      username,
      limit,
    });

    return res.render("partials/users-list-rows", { users: result.users });
  } catch (err) {
    console.error("Error getting users:", err);
    return res.render("error");
  }
};

exports.updateUser = async (req, res) => {
  const { name, photoUrl = null, description = null } = req.body;
  try {
    await updateUserById(req.user.id, {
      name,
      photoUrl: photoUrl || null,
      description: description || null,
    });

    if (req.user.type === "admin") {
      return res.status(200).redirect("/admin");
    }

    return res.status(200).redirect("/account");
  } catch (error) {
    return res.status(500).render("error");
  }
};
