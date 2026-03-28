const mongoose = require('mongoose');

const goalSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: [true, 'Vui lòng nhập tên mục tiêu']
    },
    targetAmount: {
        type: Number,
        required: [true, 'Vui lòng nhập số tiền mục tiêu']
    },
    currentAmount: {
        type: Number,
        default: 0
    },
    deadline: {
        type: Date,
        required: [true, 'Vui lòng chọn thời hạn']
    },
    category: {
        type: String,
        default: 'Tiết kiệm'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Goal', goalSchema);
