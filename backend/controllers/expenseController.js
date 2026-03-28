const Expense = require('../models/Expense');

// @desc    Create new expense
// @route   POST /api/expenses
const createExpense = async (req, res) => {
    const { title, amount, category, date, notes } = req.body;

    try {
        const expense = await Expense.create({
            user: req.user._id,
            title,
            amount,
            category,
            date,
            notes
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all expenses for user
// @route   GET /api/expenses
const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Không tìm thấy khoản chi tiêu' });
        }

        if (expense.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Người dùng không có quyền' });
        }

        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedExpense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Không tìm thấy khoản chi tiêu' });
        }

        if (expense.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Người dùng không có quyền' });
        }

        await expense.deleteOne();
        res.json({ message: 'Đã xóa khoản chi tiêu' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const { Parser } = require('json2csv');

// @desc    Export expenses to CSV
// @route   GET /api/expenses/export
const exportExpensesCSV = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });

        const fields = [
            { label: 'Ngày', value: 'date' },
            { label: 'Tiêu đề', value: 'title' },
            { label: 'Số tiền (VNĐ)', value: 'amount' },
            { label: 'Danh mục', value: 'category' },
            { label: 'Ghi chú', value: 'notes' }
        ];

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(expenses);

        res.header('Content-Type', 'text/csv; charset=utf-8');
        res.attachment(`Bao_cao_chi_tieu_${new Date().getTime()}.csv`);
        return res.send(csv);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xuất file CSV' });
    }
};

module.exports = {
    createExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
    exportExpensesCSV
};
