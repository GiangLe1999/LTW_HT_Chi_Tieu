const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
