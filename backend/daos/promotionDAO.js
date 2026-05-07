const Promotion = require('../models/Promotion');

class PromotionDAO {
    // Tìm mã giảm giá theo code (ví dụ: 'GIAMGIA50')
    async findByCode(code) {
        return await Promotion.findOne({
            code: code.toUpperCase(),
            isActive: true,
            expirationDate: { $gte: new Date() } // Đảm bảo mã chưa hết hạn
        });
    }

    // Lấy danh sách các mã giảm giá đang public
    async getActivePromotions() {
        return await Promotion.find({
            isActive: true,
            expirationDate: { $gte: new Date() }
        });
    }
}

module.exports = new PromotionDAO();