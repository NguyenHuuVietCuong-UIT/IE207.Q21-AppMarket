const express = require('express');
const router = express.Router();
const { buyApp } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

// Route này cần đi qua hàm protect để kiểm tra đăng nhập trước khi chạy hàm buyApp
router.post('/buy', protect, buyApp);

module.exports = router;