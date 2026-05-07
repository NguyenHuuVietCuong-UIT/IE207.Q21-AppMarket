const express = require('express');
const { getProfile, updateProfile, changePassword } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Tất cả các route ở đây đều đi qua middleware xác thực
router.use(protect);

router.route('/profile')
    .get(getProfile)
    .put(updateProfile);

router.put('/change-password', changePassword);

module.exports = router;