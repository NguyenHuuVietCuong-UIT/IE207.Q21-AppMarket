const userDAO = require('../daos/userDAO');
const promotionDAO = require('../daos/promotionDAO');

// @desc    Thêm phương thức thanh toán (Thẻ ngân hàng, MoMo...)
// @route   POST /api/v1/wallet/payment-methods
exports.addPaymentMethod = async (req, res) => {
    try {
        const { provider, accountNumber } = req.body;
        const userId = req.user._id;

        if (!provider || !accountNumber) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp nhà cung cấp và số tài khoản' });
        }

        const user = await userDAO.findById(userId);

        // Thêm thẻ mới vào mảng paymentMethods
        const newMethod = { provider, accountNumber, isDefault: user.paymentMethods.length === 0 };
        user.paymentMethods.push(newMethod);
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Đã thêm phương thức thanh toán',
            data: user.paymentMethods
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi thêm phương thức thanh toán', error: error.message });
    }
};

// @desc    Lấy danh sách mã giảm giá khả dụng của hệ thống
// @route   GET /api/v1/wallet/promotions
exports.getAvailablePromotions = async (req, res) => {
    try {
        const promotions = await promotionDAO.getActivePromotions();
        res.status(200).json({
            success: true,
            count: promotions.length,
            data: promotions
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi lấy mã giảm giá', error: error.message });
    }
};