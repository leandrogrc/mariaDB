const router = require("express").Router();

const {
  login,
  loginPage,
  register,
  logout,
  registerPage,
} = require("../controllers/authController");
const validateSession = require("../middlewares/validateSession");

router.get("/", validateSession, (req, res) =>
  res.status(200).redirect("/account")
);

router.route("/login").get(loginPage).post(login);
router.route("/register").get(registerPage).post(register);
router.route("/logout").post(logout);

module.exports = router;
