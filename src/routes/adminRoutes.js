const router = require("express").Router();

const {
  adminPage,
  adminLoginPage,
  registerAdmin,
} = require("../controllers/adminController");
const validateSession = require("../middlewares/validateSession");
const validateAdmin = require("../middlewares/validateAdmin");
const csrf = require("../middlewares/csrf");

router.get("/admin", validateSession, validateAdmin, adminPage);
router
  .route("/admin/register")
  .get(adminLoginPage)
  .post(csrf.validate, registerAdmin);

module.exports = router;
