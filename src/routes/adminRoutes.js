const router = require("express").Router();

const {
  adminPage,
  adminLoginPage,
  registerAdmin,
} = require("../controllers/adminController");
const { getUsers } = require("../controllers/usersControllers");

const csrf = require("../middlewares/csrf");
const validateSession = require("../middlewares/validateSession");
const validateAdmin = require("../middlewares/validateAdmin");

router.get("/admin", validateSession, validateAdmin, adminPage);
router
  .route("/admin/register")
  .get(adminLoginPage)
  .post(csrf.validate, registerAdmin);

router.get("/admin/users", validateSession, validateAdmin, getUsers);

module.exports = router;
