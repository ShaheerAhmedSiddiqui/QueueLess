const express = require('express');
const dashboard = require('../controllers/studentController');
const studentAccess = require('../middleware/studentAccess');
const router = express.Router();
router.use(studentAccess);
router.get('/dashboard', dashboard);

module.exports = router;
