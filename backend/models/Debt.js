const mongoose = require('mongoose');

const debtSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    personName: {
        type: String,
        required: [true, 'Vui lòng nhập tên người liên quan']
    },
    amount: {
        type: Number,
        required: [true, 'Vui lòng nhập số tiền']
    },
    type: {
        type: String,
        enum: ['Debt', 'Loan'], // Debt: Mình nợ họ, Loan: Họ nợ mình
        required: true
    },
    dueDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending'
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Debt', debtSchema);
