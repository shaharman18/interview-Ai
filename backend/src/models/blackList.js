const mongoose = require('mongoose');

const blackListSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, 'Token is required']
    },
    expiresAt: {
        type: Date,
        required: [true, 'Expiration date is required']
    }
}, { timestamps: true });


const BlackList = mongoose.model('BlackList', blackListSchema);
module.exports = BlackList;