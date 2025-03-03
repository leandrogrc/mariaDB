const router = require("express").Router();

const {
  login,
  loginPage,
  register,
  registerPage,
} = require("../controllers/authController");

router.route("/login").get(loginPage).post(login);
router.route("/register").get(registerPage).post(register);

module.exports = router;
