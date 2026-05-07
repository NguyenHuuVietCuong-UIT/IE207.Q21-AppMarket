const AppItem = require('../models/AppItem');

class AppDAO {
    // Lấy danh sách app có phân trang (Pagination) để không load 1000 app cùng lúc
    async getApps(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        return await AppItem.find().skip(skip).limit(limit);
    }

    // Lấy chi tiết 1 app theo ID
    async getAppById(id) {
        return await AppItem.findById(id);
    }

    //Cập nhật lại sao trung bình và tổng số lượt đánh giá
    async updateAppRating(appId, averageRating, reviewsCount) {
        return await AppItem.findByIdAndUpdate(
            appId,
            {
                score: Math.round(averageRating * 10) / 10, // Làm tròn 1 chữ số thập phân (VD: 4.5)
                reviews: reviewsCount
            },
            { new: true }
        );
    }
}

module.exports = new AppDAO();