const express = require("express");
const router = express.Router();
const {
  postLink,
  updateLink,
  deleteLink,
  getCreateLinkPage,
  getUpdateLinkPage,
} = require("../controllers/linksControllers");
const validateSession = require("../middlewares/validateSession");
const { getUserPage } = require("../controllers/usersControllers");

router.get("/links/:username", getUserPage);

router.use(validateSession);

router.route("/account/link").get(getCreateLinkPage).post(postLink);
router.get("/account/link/:id", getUpdateLinkPage);
router.post("/account/link/:id/update", updateLink);
router.post("/account/link/:id/delete", deleteLink);

module.exports = router;
