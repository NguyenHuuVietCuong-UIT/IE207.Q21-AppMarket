const express = require('express');
const { processTransaction, downloadAppFile, uninstallApp } = require('../controllers/transactionController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Tất cả các route trong này đều phải đi qua middleware protect (Bắt buộc đăng nhập)
router.post('/process', protect, processTransaction);
router.get('/download/:appId', protect, downloadAppFile);

// Route gỡ cài đặt ứng dụng (Dùng PUT vì ta đang cập nhật trạng thái của tài nguyên có sẵn)
router.put('/uninstall/:appId', protect, uninstallApp);

module.exports = router;