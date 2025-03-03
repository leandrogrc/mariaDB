const router = require("express").Router();

const { login, loginPage, register } = require("../controllers/authController");

router.route("/login").get(loginPage).post(login);
router.post("/register", register);

module.exports = router;
