const router = require("express").Router();

const {
  dashboardPage,
  settingsPage,
  addAdmin,
  getUserDetails,
  updateSettings,
} = require("../controllers/adminController");
const { getUsers } = require("../controllers/usersControllers");

const csrf = require("../middlewares/csrf");
const validateSession = require("../middlewares/validateSession");
const validateAdmin = require("../middlewares/validateAdmin");

router.get("/admin", validateSession, validateAdmin, (_req, res) =>
  res.redirect("/admin/dashboard")
);
router.get("/admin/dashboard", validateSession, validateAdmin, dashboardPage);
router
  .route("/admin/settings")
  .get(validateSession, validateAdmin, settingsPage)
  .post(validateSession, validateAdmin, csrf.validate, updateSettings);

router.post(
  "/admin/new",
  validateSession,
  validateAdmin,
  csrf.validate,
  addAdmin
);

router.get("/admin/users", validateSession, validateAdmin, getUsers);
router.get("/admin/users/:id", validateSession, validateAdmin, getUserDetails);

module.exports = router;
