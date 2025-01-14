const {
  getAllUsers,
  getUserByUsername: getUserByName,
  postNewUser,
  deleteUser,
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
    const result = await getUserByName(username);
    res.status(200).json({ message: "Users fetched", users: result.response });
  } catch (err) {
    console.error("Error getting users:", err);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
};

// POST new user
exports.postUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ error: "Username and Password are required" });
  try {
    const result = await postNewUser(username, password);
    if (result.success) {
      return res.status(200).json({
        message: "User added successfully",
        insertId: result.insertId,
      });
    } else {
      return res.status(500).json({
        error: "Failed to add user",
        details: result.message || result.error,
      });
    }
  } catch (err) {
    console.error("Error in post user func:", err);
    return res.status(500).json({ error: "Failed to add user" });
  }
};

// PUT a user
// TODO: update user
exports.updateUser = (req, res) => res.json("PUT user ID = " + req.params.id);

// DELETE a user
exports.delUser = async (req, res) => {
  const { username } = req.params;
  try {
    const result = await deleteUser(username);
    console.log(result);
    return res.status(200).json({ message: "All users deleted!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete all users" });
  }
};
