const express = require("express");
const router = express.Router();
const {
  getUserByUsername,
  getUsers,
  postUser,
  updateUser,
  delUser,
} = require("../controllers/usersControllers");

router.route("/api/users").get(getUsers).post(postUser);
router.route("/api/users/:id").put(updateUser);
router.route("/api/users/:username").delete(delUser).get(getUserByUsername);

module.exports = router;
