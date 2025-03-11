const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserPanel,
  updateUser,
} = require("../controllers/usersControllers");
const validateSession = require("../middlewares/validateSession");
const csrf = require("../middlewares/csrf");

router.use(validateSession);

router.get("/", getUsers);
router.route("/account").get(getUserPanel).post(csrf.validate, updateUser);

// router.route("/:username").delete(delUser).get(getUserByUsername);

module.exports = router;
