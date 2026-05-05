const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
} = require('../controllers/leadController');

router.use(verifyToken);

router.get('/', getLeads);
router.get('/:id', getLead);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

module.exports = router;
