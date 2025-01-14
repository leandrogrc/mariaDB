const router = require("express").Router();

const { login, register } = require("../controllers/authController");

router.post("/api/login", login);
router.post("/api/register", register);

module.exports = router;
