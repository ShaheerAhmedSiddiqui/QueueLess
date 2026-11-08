const express = require('express');
const {dashboard, profile, myQueues, service, queueStatus} = require('../controllers/studentController');
const studentAccess = require('../middleware/studentAccess');
const router = express.Router();
router.use(studentAccess);
router.get('/dashboard', dashboard);
router.get('/profile', profile);
router.get('/my-queues', myQueues);
router.get('/services', service);
router.get('/queue-status', queueStatus);



module.exports = router;
