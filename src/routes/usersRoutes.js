const express = require("express");
const router = express.Router();
const { getUsers, getUserPanel } = require("../controllers/usersControllers");
const validateSession = require("../middlewares/validateSession");

router.use(validateSession);

router.route("/").get(getUsers);
router.route("/account").get(getUserPanel);

// router.route("/:id").put(updateUser);
// router.route("/:username").delete(delUser).get(getUserByUsername);

module.exports = router;
