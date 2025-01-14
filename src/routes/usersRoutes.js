const express = require("express");
const router = express.Router();
const {
  getUserByUsername,
  getUsers,
  updateUser,
  delUser,
} = require("../controllers/usersControllers");

router.route("/api/users").get(getUsers);
router.route("/api/users/:id").put(updateUser);
router.route("/api/users/:username").delete(delUser).get(getUserByUsername);

module.exports = router;
