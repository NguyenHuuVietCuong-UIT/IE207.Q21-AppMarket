const express = require('express');
const router = express.Router();
const { getApps, getAppById, createApp, searchApps, getRelatedApps, downloadAppDemo } = require('../controllers/appController');
const { protect } = require('../middlewares/authMiddleware');

// Các route chung
router.route('/')
    .get(getApps)
    .post(createApp);

// Route TÌM KIẾM (Phải đặt trước /:id)
router.get('/search', searchApps);

// Các route liên quan đến 1 ID cụ thể
router.route('/:id')
    .get(getAppById);

// Route ĐỀ XUẤT
router.get('/:id/recommendations', getRelatedApps);

// Route TẢI XUỐNG (Cần protect)
router.get('/:id/download', protect, downloadAppDemo);

module.exports = router;