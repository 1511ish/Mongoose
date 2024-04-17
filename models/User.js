
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email_Id: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    totalexpenses: {
        type: Number,
        default: 0
    },
    ispremiumuser: {
        type: Boolean,
        default: false
    },
    order: {
        order_id: {
            type: String
        },
        status: {
            type: String
        },
        payment_id: {
            type: String
        },
        createdAt: {
            type: Date
        }
    }
})

module.exports = mongoose.model('User', userSchema);