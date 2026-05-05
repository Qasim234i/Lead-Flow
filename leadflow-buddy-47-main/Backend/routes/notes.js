const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const { getNotes, createNote } = require('../controllers/noteController');

router.use(verifyToken);

router.get('/:leadId', getNotes);
router.post('/', createNote);

module.exports = router;
