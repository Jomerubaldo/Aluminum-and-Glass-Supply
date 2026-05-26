const express = require('express');
const router = express.Router();
const { getStats, getChartData, getHistory } = require('../controllers/dashboardController');

router.get('/stats', getStats);
router.get('/chart', getChartData);
router.get('/history', getHistory);

module.exports = router;
