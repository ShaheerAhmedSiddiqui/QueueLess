const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const router = express.Router();

router.get('/student/dashboard', requireAuth, requireRole('STUDENT'),
  (req, res) => res.send('Student dashboard - ' + req.session.user.name));
router.get('/staff/dashboard', requireAuth, requireRole('STAFF'),
  (req, res) => res.send('Staff dashboard - ' + req.session.user.name));
router.get('/admin/dashboard', requireAuth, requireRole('ADMIN'),
  (req, res) => res.send('Admin dashboard - ' + req.session.user.name));

module.exports = router;