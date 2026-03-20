const Order = require('../models/Order');
const User = require('../models/User');
const App = require('../models/App');

// @desc    Mua ứng dụng
// @route   POST /api/orders/buy
// @access  Private (Cần Token)
const buyApp = async (req, res) => {
    try {
        const { appId } = req.body;
        const userId = req.user._id; // Lấy từ authMiddleware

        // 1. Kiểm tra app có tồn tại không
        const app = await App.findById(appId);
        if (!app) return res.status(404).json({ message: 'Không tìm thấy ứng dụng' });

        // 2. Kiểm tra xem user đã mua app này chưa
        const user = await User.findById(userId);
        if (user.purchasedApps.includes(appId)) {
            return res.status(400).json({ message: 'Bạn đã sở hữu ứng dụng này rồi' });
        }

        // 3. Tạo đơn hàng mới
        const order = await Order.create({
            user: userId,
            app: appId,
            amount: app.price,
            status: 'completed'
        });

        // 4. Thêm App ID vào mảng purchasedApps của User
        user.purchasedApps.push(appId);
        await user.save();

        res.status(201).json({ success: true, message: 'Mua ứng dụng thành công', data: order });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

module.exports = { buyApp };