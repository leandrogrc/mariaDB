const router = require("express").Router();

const {
  adminPage,
  addAdmin,
  getUserDetails,
} = require("../controllers/adminController");
const { getUsers } = require("../controllers/usersControllers");

const csrf = require("../middlewares/csrf");
const validateSession = require("../middlewares/validateSession");
const validateAdmin = require("../middlewares/validateAdmin");

router.get("/admin", validateSession, validateAdmin, adminPage);
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
