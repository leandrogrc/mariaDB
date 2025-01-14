const {
  getAllUsers,
  getUserLinks,
  deleteUserByUsername,
} = require("../db/users");

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
