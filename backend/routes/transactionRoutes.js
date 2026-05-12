const express = require('express');
const {
    processTransaction,
    downloadAppFile,
    uninstallApp,
    getMyHistory // Thêm hàm này
} = require('../controllers/transactionController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Tất cả route đều phải qua protect
router.use(protect);

router.get('/my-history', getMyHistory); // Route mới cho trang Lịch sử
router.post('/process', processTransaction);
router.get('/download/:appId', downloadAppFile);
router.put('/uninstall/:appId', uninstallApp);

module.exports = router;