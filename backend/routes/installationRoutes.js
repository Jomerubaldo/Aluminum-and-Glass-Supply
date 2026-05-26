const express = require('express');
const router = express.Router();
const { getInstallations, markAsDone } = require('../controllers/installationController');

router.get('/', getInstallations);
router.patch('/:id/done', markAsDone);

module.exports = router;
