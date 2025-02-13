const {
  getAllUsers,
  getUserLinks,
  getUserByUsername,
  deleteUserByUsername,
} = require("../db/users");
const { getLinksByUserId } = require("../db/links");

exports.getUserPage = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await getUserByUsername(username);
    if (!user.response?.id) {
      // TODO: 404 page
      return res.status(404).send();
    }
    const links = await getLinksByUserId(user.response.id);

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

// PUT a user
// TODO: update user
exports.updateUser = (req, res) => res.json("PUT user ID = " + req.params.id);

// DELETE a user
exports.delUser = async (req, res) => {
  const { username } = req.params;
  try {
    const result = await deleteUserByUsername(username);
    console.log(result);
    return res.status(200).json({ message: "All users deleted!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete all users" });
  }
};
