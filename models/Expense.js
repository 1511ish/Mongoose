
const mongoose = require('mongoose');
const { Schema } = mongoose;

const expensesSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref:'User',
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
    description:{
        type: String,
    },
    date: {
        type: Date
        // default: Date.now
    }
});

module.exports = mongoose.model('Expenses', expensesSchema);