const express = require('express');
const {dashboard, profile, myQueues} = require('../controllers/studentController');
const studentAccess = require('../middleware/studentAccess');
const router = express.Router();
router.use(studentAccess);
router.get('/dashboard', dashboard);
router.get('/profile', profile);
router.get('/my-queues', myQueues);


module.exports = router;
