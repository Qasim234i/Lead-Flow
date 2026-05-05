const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const { getDashboard } = require('../controllers/dashboardController');

router.use(verifyToken);

router.get('/', getDashboard);

module.exports = router;
