const express = require('express');
const router = express.Router();
const { getDebts, createDebt, updateDebtStatus, deleteDebt } = require('../controllers/debtController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getDebts)
    .post(protect, createDebt);

router.route('/:id')
    .put(protect, updateDebtStatus)
    .delete(protect, deleteDebt);

module.exports = router;
