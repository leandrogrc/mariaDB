const express = require("express");
const router = express.Router();
const {
  postLink,
  updateLink,
  deleteLink,
  getCreateLinkPage,
  getUpdateLinkPage,
} = require("../controllers/linksControllers");
const csrf = require("../middlewares/csrf");
const validateSession = require("../middlewares/validateSession");
const { getUserPage } = require("../controllers/usersControllers");

router.get("/links/:username", getUserPage);

router.use(validateSession);

router
  .route("/account/link")
  .get(getCreateLinkPage)
  .post(csrf.validate, postLink);
router.get("/account/link/:id", getUpdateLinkPage);
router.post("/account/link/:id/update", csrf.validate, updateLink);
router.post("/account/link/:id/delete", csrf.validate, deleteLink);

module.exports = router;
