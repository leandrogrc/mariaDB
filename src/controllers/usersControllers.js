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

// GET all users
exports.getUsers = async (req, res) => {
  try {
    const result = await getAllUsers();
    res.status(200).json({ message: "Users fetched", users: result.users });
  } catch (err) {
    console.error("Error getting users:", err);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
};

// GET single user
exports.getUserByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const result = await getUserLinks(username);
    res.status(200).json({ message: "Users fetched", users: result.response });
  } catch (err) {
    console.error("Error getting users:", err);
    return res.status(500).json({ error: "Failed to fetch users" });
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

// DELETE a user
exports.delUser = async (req, res) => {
  const { username } = req.params;
  try {
    await deleteUserByUsername(username);
    return res.status(200).json({ message: "All users deleted!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete all users" });
  }
};
