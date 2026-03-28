const Budget = require('../models/Budget');

// @desc    Create or update budget
// @route   POST /api/budgets
const setBudget = async (req, res) => {
    const { amount, month } = req.body;

    try {
        let budget = await Budget.findOne({ user: req.user._id, month });

        if (budget) {
            budget.amount = amount;
            await budget.save();
            res.json(budget);
        } else {
            budget = await Budget.create({
                user: req.user._id,
                amount,
                month
            });
            res.status(201).json(budget);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get budget for a specific month
// @route   GET /api/budgets/:month
const getBudget = async (req, res) => {
    try {
        const budget = await Budget.findOne({ user: req.user._id, month: req.params.month });
        if (budget) {
            res.json(budget);
        } else {
            res.status(404).json({ message: 'Không tìm thấy ngân sách cho tháng này' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    setBudget,
    getBudget
};
