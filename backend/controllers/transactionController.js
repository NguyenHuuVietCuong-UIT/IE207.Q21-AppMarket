const transactionDAO = require('../daos/transactionDAO');
const appDAO = require('../daos/appDAO'); // Cần gọi appDAO để lấy thông tin giá và dung lượng
const promotionDAO = require('../daos/promotionDAO'); // Dùng để áp dụng mã giảm giá sau này

// @desc    Xử lý tải app miễn phí hoặc mua app tốn phí
// @route   POST /api/v1/transactions/process
exports.processTransaction = async (req, res) => {
    try {
        // Nhận thêm promotionCode và paymentMethodId từ body
        const { appId, promotionCode, paymentMethodId } = req.body;
        const userId = req.user._id;

        const app = await appDAO.getAppById(appId);
        if (!app) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy ứng dụng' });
        }

        let transaction = await transactionDAO.findTransactionByUserAndApp(userId, appId);

        if (transaction) {
            if (transaction.status === 'UNINSTALLED') {
                transaction = await transactionDAO.updateTransactionStatus(transaction._id, 'SUCCESS');
            }
            return res.status(200).json({
                success: true,
                message: 'Bạn đã sở hữu ứng dụng này',
                data: app
            });
        }

        const isFree = app.price === 0;
        let finalAmount = app.price;
        let appliedPromotionId = null;

        // --- LOGIC XỬ LÝ KHUYẾN MÃI ---
        if (!isFree && promotionCode) {
            const promotion = await promotionDAO.findByCode(promotionCode);
            if (!promotion) {
                return res.status(400).json({ success: false, message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn' });
            }
            // Tính tiền sau khi giảm (Ví dụ: giảm 20% -> lấy giá gốc trừ đi 20%)
            const discount = (app.price * promotion.discountPercentage) / 100;
            finalAmount = app.price - discount;
            appliedPromotionId = promotion._id;
        }

        // --- LOGIC XỬ LÝ THANH TOÁN GIẢ ---
        if (!isFree && finalAmount > 0) {
            if (!paymentMethodId) {
                // Nếu app tốn phí mà không truyền phương thức thanh toán -> Báo lỗi
                return res.status(400).json({ success: false, message: 'Vui lòng chọn phương thức thanh toán' });
            }
            // Ở môi trường thực tế, ta sẽ gọi API của VNPay/MoMo tại đây.
            // Với đồ án, ta giả lập thanh toán luôn thành công.
        }

        // Ghi nhận giao dịch vào DB
        transaction = await transactionDAO.createTransaction({
            user: userId,
            app: appId,
            type: isFree ? 'DOWNLOAD' : 'PURCHASE',
            priceAtPurchase: app.price,
            appliedPromotion: appliedPromotionId,
            finalAmount: finalAmount, // Số tiền thực tế sau khi áp mã
            status: 'SUCCESS'
        });

        res.status(201).json({
            success: true,
            message: isFree ? 'Bắt đầu tải ứng dụng' : `Thanh toán ${finalAmount.toLocaleString('vi-VN')} VNĐ thành công!`,
            data: app
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi xử lý giao dịch', error: error.message });
    }
};

// @desc    Tải file .txt mô phỏng ứng dụng về máy
// @route   GET /api/v1/transactions/download/:appId
exports.downloadAppFile = async (req, res) => {
    try {
        const appId = req.params.appId;
        const userId = req.user._id;

        // Phải kiểm tra xem user ĐÃ CÓ GIAO DỊCH (đã mua/tải) chưa mới cho tải file
        const transaction = await transactionDAO.findTransactionByUserAndApp(userId, appId);
        if (!transaction || transaction.status !== 'SUCCESS') {
            return res.status(403).json({ success: false, message: 'Bạn chưa mua hoặc cài đặt ứng dụng này' });
        }

        const app = await appDAO.getAppById(appId);

        // Tạo nội dung file text
        const fileContent = `=======================================\n` +
            `  ỨNG DỤNG: ${app.title}\n` +
            `  NHÀ PHÁT TRIỂN: ${app.developer}\n` +
            `  THỜI GIAN TẢI: ${new Date().toLocaleString('vi-VN')}\n` +
            `  CHỦ SỞ HỮU: ${req.user.fullName} (${req.user.email || req.user.phone})\n` +
            `=======================================\n` +
            `Chúc bạn sử dụng ứng dụng vui vẻ!`;

        // Tên file khi tải về (Loại bỏ khoảng trắng, thay bằng dấu gạch dưới)
        const fileName = `${app.title.replace(/\s+/g, '_')}_installed.txt`;

        // Set Header để ép trình duyệt hiểu đây là file cần tải xuống
        res.setHeader('Content-disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-type', 'text/plain; charset=utf-8');

        // Gửi file
        res.send(fileContent);

    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi tải file', error: error.message });
    }
};

// @desc    Gỡ cài đặt ứng dụng
// @route   PUT /api/v1/transactions/uninstall/:appId
exports.uninstallApp = async (req, res) => {
    try {
        const appId = req.params.appId;
        const userId = req.user._id;

        // Lấy thông tin giao dịch thông qua DAO
        let transaction = await transactionDAO.findTransactionByUserAndApp(userId, appId);

        // Kiểm tra xem ứng dụng đã được cài đặt (SUCCESS) chưa
        if (!transaction || transaction.status !== 'SUCCESS') {
            return res.status(400).json({
                success: false,
                message: 'Bạn chưa cài đặt ứng dụng này, không thể gỡ cài đặt.'
            });
        }

        // Cập nhật trạng thái giao dịch sang 'UNINSTALLED' (Đã gỡ cài đặt)
        // Hàm updateTransactionStatus đã được định nghĩa trong transactionDAO.js trước đó
        transaction = await transactionDAO.updateTransactionStatus(transaction._id, 'UNINSTALLED');

        res.status(200).json({
            success: true,
            message: 'Gỡ cài đặt thành công. Bạn có thể tải lại ứng dụng này bất cứ lúc nào.',
            data: transaction
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi hệ thống khi gỡ cài đặt', error: error.message });
    }
};