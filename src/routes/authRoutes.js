const router = require("express").Router();

const {
  login,
  loginPage,
  register,
  logout,
  registerPage,
} = require("../controllers/authController");
const csrf = require("../middlewares/csrf");
const validateSession = require("../middlewares/validateSession");

router.get("/", validateSession, (_req, res) =>
  res.status(200).redirect("/account")
);

router.route("/login").get(loginPage).post(csrf.validate, login);
router.route("/register").get(registerPage).post(csrf.validate, register);
router.post("/logout", validateSession, csrf.validate, logout);

module.exports = router;
