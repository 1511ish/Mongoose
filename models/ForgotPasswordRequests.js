
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forgetPasswordSchema = new Schema({
  isActive: {
    type: Boolean,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  }
})

module.exports = mongoose.model('forget_password', forgetPasswordSchema);