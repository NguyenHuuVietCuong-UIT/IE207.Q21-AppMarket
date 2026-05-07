const express = require('express');
const { addReview, getAppReviews } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

// mergeParams: true cho phép lấy các tham số (như appId) từ router cha (appRoutes) truyền xuống
const router = express.Router({ mergeParams: true });

router.route('/')
    .get(getAppReviews) // Xem danh sách thì ai cũng xem được (Public)
    .post(protect, addReview); // Viết đánh giá thì phải đăng nhập (Protected)

module.exports = router;