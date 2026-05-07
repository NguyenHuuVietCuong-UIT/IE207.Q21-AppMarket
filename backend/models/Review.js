const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    app: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AppItem',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Đảm bảo 1 user chỉ được đánh giá 1 app 1 lần
reviewSchema.index({ user: 1, app: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);