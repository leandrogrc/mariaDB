const express = require("express");
const router = express.Router();
const {
  getSingleLink,
  getLinks,
  postLink,
  updateLink,
  deleteLink,
} = require("../controllers/linksControllers");
const validateSession = require("../middlewares/validateSession");

router.use(validateSession);

router.route("").get(getLinks).post(postLink);
router.route("/:id").get(getSingleLink).put(updateLink).delete(deleteLink);

module.exports = router;
