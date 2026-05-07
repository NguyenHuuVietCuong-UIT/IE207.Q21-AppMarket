const mongoose = require('mongoose');
const Review = require('../models/Review');

class ReviewDAO {
    // Tạo đánh giá mới
    async createReview(reviewData) {
        const review = new Review(reviewData);
        return await review.save();
    }

    // Kiểm tra xem user đã từng đánh giá app này chưa (1 user chỉ đánh giá 1 lần/app)
    async findReviewByUserAndApp(userId, appId) {
        return await Review.findOne({ user: userId, app: appId });
    }

    // Lấy toàn bộ đánh giá của một ứng dụng (sắp xếp mới nhất lên đầu, kèm tên người đánh giá)
    async getReviewsByApp(appId) {
        return await Review.find({ app: appId })
            .populate('user', 'fullName') // Lấy tên người dùng từ bảng User
            .sort({ createdAt: -1 });
    }

    // Sử dụng Aggregation của MongoDB để tính toán lại điểm đánh giá trung bình
    async calculateAverageRating(appId) {
        const obj = await Review.aggregate([
            { $match: { app: new mongoose.Types.ObjectId(appId) } },
            {
                $group: {
                    _id: '$app',
                    averageRating: { $avg: '$rating' }, // Tính trung bình cộng cột rating
                    numOfReviews: { $sum: 1 } // Đếm tổng số lượng comment
                }
            }
        ]);
        return obj;
    }
}

module.exports = new ReviewDAO();