const express = require('express');
const {
    addPaymentMethod,
    getAvailablePromotions,
    deletePaymentMethod,
    setDefaultPaymentMethod,
    getMyPromotions
} = require('../controllers/walletController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect); // Yêu cầu đăng nhập

router.post('/payment-methods', addPaymentMethod);
router.delete('/payment-methods/:id', deletePaymentMethod);
router.put('/payment-methods/:id/default', setDefaultPaymentMethod); // Thêm dòng này
router.get('/my-promotions', getMyPromotions); // Thêm dòng này
router.get('/promotions', getAvailablePromotions);

module.exports = router;