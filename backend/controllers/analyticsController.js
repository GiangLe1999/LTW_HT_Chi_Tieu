const Expense = require('../models/Expense');

// @desc    Get expenses grouped by category
// @route   GET /api/analytics/category
const getCategoryAnalytics = async (req, res) => {
    try {
        const analytics = await Expense.aggregate([
            { $match: { user: req.user._id } },
            {
                $group: {
                    _id: '$category',
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);
        res.json(analytics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get monthly analytics
// @route   GET /api/analytics/monthly
const getMonthlyAnalytics = async (req, res) => {
    try {
        const analytics = await Expense.aggregate([
            { $match: { user: req.user._id } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
                    totalAmount: { $sum: '$amount' }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.json(analytics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCategoryAnalytics,
    getMonthlyAnalytics
};
