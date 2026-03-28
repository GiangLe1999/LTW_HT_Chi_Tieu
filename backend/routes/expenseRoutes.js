const express = require('express');
const router = express.Router();
const { createExpense, getExpenses, updateExpense, deleteExpense, exportExpensesCSV } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

router.get('/export', protect, exportExpensesCSV);

router.route('/')
    .post(protect, createExpense)
    .get(protect, getExpenses);

router.route('/:id')
    .put(protect, updateExpense)
    .delete(protect, deleteExpense);

module.exports = router;
