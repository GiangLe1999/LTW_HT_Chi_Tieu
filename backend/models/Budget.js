const mongoose = require('mongoose');

const budgetSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true
    },
    month: {
        type: String, // format YYYY-MM
        required: true
    }
}, {
    timestamps: true
});

const Budget = mongoose.model('Budget', budgetSchema);
module.exports = Budget;
