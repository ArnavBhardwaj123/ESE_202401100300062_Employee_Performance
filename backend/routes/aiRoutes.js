const router = require('express').Router();
const { getRecommendation } = require('../controllers/aiController');
const auth = require('../middleware/auth');

router.post('/recommend', auth, getRecommendation);

module.exports = router;
