const Goal = require('../models/Goal');

// @desc    Get all goals for a user
// @route   GET /api/goals
const getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user._id }).sort({ deadline: 1 });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách mục tiêu' });
    }
};

// @desc    Create a new goal
// @route   POST /api/goals
const createGoal = async (req, res) => {
    const { name, targetAmount, deadline, currentAmount } = req.body;

    try {
        const goal = await Goal.create({
            user: req.user._id,
            name,
            targetAmount,
            currentAmount: currentAmount || 0,
            deadline
        });

        res.status(201).json(goal);
    } catch (error) {
        res.status(400).json({ message: error.message || 'Dữ liệu không hợp lệ' });
    }
};

// @desc    Update a goal (including adding to currentAmount)
// @route   PUT /api/goals/:id
const updateGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json({ message: 'Không tìm thấy mục tiêu' });
        }

        if (goal.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Không có quyền thay đổi' });
        }

        const updatedGoal = await Goal.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedGoal);
    } catch (error) {
        res.status(400).json({ message: 'Cập nhật mục tiêu thất bại' });
    }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
const deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json({ message: 'Không tìm thấy mục tiêu' });
        }

        if (goal.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Không có quyền xóa' });
        }

        await goal.deleteOne();
        res.json({ message: 'Đã xóa mục tiêu' });
    } catch (error) {
        res.status(500).json({ message: 'Xóa mục tiêu thất bại' });
    }
};

module.exports = {
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal
};
