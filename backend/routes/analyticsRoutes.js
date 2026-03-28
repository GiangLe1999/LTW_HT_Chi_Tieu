const express = require('express');
const router = express.Router();
const { getCategoryAnalytics, getMonthlyAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/category', protect, getCategoryAnalytics);
router.get('/monthly', protect, getMonthlyAnalytics);

module.exports = router;
