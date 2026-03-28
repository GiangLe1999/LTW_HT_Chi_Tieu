const Debt = require('../models/Debt');

// @desc    Get all debts/loans for a user
// @route   GET /api/debts
const getDebts = async (req, res) => {
    try {
        const debts = await Debt.find({ user: req.user._id }).sort({ dueDate: 1 });
        res.json(debts);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách nợ' });
    }
};

// @desc    Create a new debt/loan
// @route   POST /api/debts
const createDebt = async (req, res) => {
    const { personName, amount, type, dueDate, notes } = req.body;

    try {
        const debt = await Debt.create({
            user: req.user._id,
            personName,
            amount,
            type,
            dueDate,
            notes
        });

        res.status(201).json(debt);
    } catch (error) {
        res.status(400).json({ message: error.message || 'Dữ liệu không hợp lệ' });
    }
};

// @desc    Update debt status (Paid/Pending)
// @route   PUT /api/debts/:id
const updateDebtStatus = async (req, res) => {
    try {
        const debt = await Debt.findById(req.params.id);

        if (!debt || debt.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin' });
        }

        debt.status = req.body.status || debt.status;
        const updatedDebt = await debt.save();

        res.json(updatedDebt);
    } catch (error) {
        res.status(400).json({ message: 'Cập nhật trạng thái thất bại' });
    }
};

// @desc    Delete a debt record
// @route   DELETE /api/debts/:id
const deleteDebt = async (req, res) => {
    try {
        const debt = await Debt.findById(req.params.id);

        if (!debt || debt.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin' });
        }

        await debt.deleteOne();
        res.json({ message: 'Đã xóa thông tin nợ' });
    } catch (error) {
        res.status(500).json({ message: 'Xóa thất bại' });
    }
};

module.exports = {
    getDebts,
    createDebt,
    updateDebtStatus,
    deleteDebt
};
