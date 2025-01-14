const express = require('express');
const router = express.Router();
const {
    getSingleLink,
    getLinks,
    postLink,
    updateLink,
    deleteLink
} = require('../controllers/linksControllers');

router.route('/api/links').get(getLinks).post(postLink);
router.route('/api/links/:id').get(getSingleLink).put(updateLink).delete(deleteLink);

module.exports = router;