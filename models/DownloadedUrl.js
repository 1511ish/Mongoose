
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const downloaded_files_Schema = new Schema({
    fileUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true
    }
})

module.exports = mongoose.model('downloaded_files', downloaded_files_Schema);