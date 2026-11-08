const express = require('express');
const {dashboard, profile, myQueues, service} = require('../controllers/studentController');
const studentAccess = require('../middleware/studentAccess');
const router = express.Router();
router.use(studentAccess);
router.get('/dashboard', dashboard);
router.get('/profile', profile);
router.get('/my-queues', myQueues);
router.get('/services', service);


module.exports = router;
