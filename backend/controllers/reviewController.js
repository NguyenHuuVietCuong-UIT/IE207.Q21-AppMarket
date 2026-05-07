const reviewDAO = require('../daos/reviewDAO');
const transactionDAO = require('../daos/transactionDAO');
const appDAO = require('../daos/appDAO');

// @desc    Thêm đánh giá và bình luận cho App
// @route   POST /api/v1/apps/:appId/reviews
exports.addReview = async (req, res) => {
    try {
        const appId = req.params.appId;
        const userId = req.user._id;
        const { rating, comment } = req.body;

        // 1. Kiểm tra tính hợp lệ của dữ liệu đầu vào
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Vui lòng đánh giá từ 1 đến 5 sao' });
        }
        if (!comment) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập nội dung bình luận' });
        }

        // 2. NGHIỆP VỤ CỐT LÕI: Phải mua hoặc tải rồi mới được đánh giá
        const transaction = await transactionDAO.findTransactionByUserAndApp(userId, appId);
        if (!transaction) {
            return res.status(403).json({ success: false, message: 'Bạn phải cài đặt ứng dụng này trước khi đánh giá' });
        }

        // 3. Kiểm tra xem user đã đánh giá chưa (tránh spam đánh giá)
        const existingReview = await reviewDAO.findReviewByUserAndApp(userId, appId);
        if (existingReview) {
            return res.status(400).json({ success: false, message: 'Bạn đã đánh giá ứng dụng này rồi' });
        }

        // 4. Lưu đánh giá vào database
        const review = await reviewDAO.createReview({
            user: userId,
            app: appId,
            rating,
            comment
        });

        // 5. Cập nhật lại điểm đánh giá trung bình của App
        const stat = await reviewDAO.calculateAverageRating(appId);
        if (stat.length > 0) {
            await appDAO.updateAppRating(appId, stat[0].averageRating, stat[0].numOfReviews);
        }

        res.status(201).json({
            success: true,
            message: 'Cảm ơn bạn đã để lại đánh giá',
            data: review
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi thêm đánh giá', error: error.message });
    }
};

// @desc    Lấy danh sách đánh giá của 1 App
// @route   GET /api/v1/apps/:appId/reviews
exports.getAppReviews = async (req, res) => {
    try {
        const appId = req.params.appId;

        // Bất kỳ ai cũng có thể xem đánh giá (không cần đăng nhập)
        const reviews = await reviewDAO.getReviewsByApp(appId);

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi tải danh sách đánh giá', error: error.message });
    }
};