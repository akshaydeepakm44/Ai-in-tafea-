const express = require('express');
const { getAnalyticsData } = require('../controllers/analyticsController');

const router = express.Router();

router.get('/getAnalyticsData', getAnalyticsData);

module.exports = router;
