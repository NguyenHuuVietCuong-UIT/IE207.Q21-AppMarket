const express = require('express');
const AppController = require('../controllers/appController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// Điều hướng request đánh giá sang reviewRoutes
// Vd: GET hoặc POST đến /api/v1/apps/:appId/reviews
router.use('/:appId/reviews', reviewRouter);

router.get('/sliders', AppController.getSliderApps);
router.get('/suggestions', AppController.getAppSuggestions);
router.get('/search-results', AppController.getSearchResults);
router.get('/detail/:title', AppController.getAppDetailByName);
router.post('/:id/download-count', AppController.incrementDownload);

module.exports = router;