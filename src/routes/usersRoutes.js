const express = require("express");
const router = express.Router();
const {
  getUserByUsername,
  getUsers,
  updateUser,
  delUser,
} = require("../controllers/usersControllers");
const validateSession = require("../middlewares/validateSession");

router.use(validateSession);

router.route("").get(getUsers);
router.route("/:id").put(updateUser);
router.route("/:username").delete(delUser).get(getUserByUsername);

module.exports = router;
