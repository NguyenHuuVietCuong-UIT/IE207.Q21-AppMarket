const express = require('express');
const { addPaymentMethod, getAvailablePromotions } = require('../controllers/walletController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect); // Yêu cầu đăng nhập

router.post('/payment-methods', addPaymentMethod);
router.get('/promotions', getAvailablePromotions);

module.exports = router;