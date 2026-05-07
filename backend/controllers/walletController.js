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

// @desc    Xóa phương thức thanh toán
// @route   DELETE /api/v1/wallet/payment-methods/:id
exports.deletePaymentMethod = async (req, res) => {
    try {
        const userId = req.user._id;
        const methodId = req.params.id;

        const user = await userDAO.findById(userId);

        // Lọc bỏ phương thức thanh toán có _id trùng với methodId truyền lên
        user.paymentMethods = user.paymentMethods.filter(
            (method) => method._id.toString() !== methodId
        );

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Đã xóa phương thức thanh toán'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi xóa phương thức thanh toán', error: error.message });
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

// @desc    Đặt phương thức thanh toán làm mặc định
// @route   PUT /api/v1/wallet/payment-methods/:id/default
exports.setDefaultPaymentMethod = async (req, res) => {
    try {
        const userId = req.user._id;
        const methodId = req.params.id;

        const user = await userDAO.findById(userId);

        // Đặt tất cả về false, sau đó đặt cái được chọn thành true
        user.paymentMethods.forEach(method => {
            method.isDefault = method._id.toString() === methodId;
        });

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Đã đặt làm phương thức mặc định',
            data: user.paymentMethods
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi đặt mặc định', error: error.message });
    }
};

// @desc    Lấy mã giảm giá sở hữu bởi người dùng
// @route   GET /api/v1/wallet/my-promotions
exports.getMyPromotions = async (req, res) => {
    try {
        // Tìm user và populate thông tin từ bảng Promotion
        const user = await userDAO.findById(req.user._id);
        // Lưu ý: Cần đảm bảo trong userDAO.findById có populate('ownedPromotions')

        res.status(200).json({
            success: true,
            data: user.ownedPromotions || []
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi lấy mã giảm giá của tôi', error: error.message });
    }
};