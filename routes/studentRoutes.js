const express = require('express');
const {
  dashboard,
  profile,
  updateProfile,
  changePassword,
  myQueues,
  service,
  queueStatus,
  stdhistory,
  joinQueue
} = require('../controllers/studentController');
const studentAccess = require('../middleware/studentAccess');
const router = express.Router();
router.use(studentAccess);
router.get('/dashboard', dashboard);
router.get('/profile', profile);
router.post('/profile', updateProfile);
router.post('/change-password', changePassword);
router.get('/my-queues', myQueues);
router.get('/services', service);
router.get('/queue-status', queueStatus);
router.get('/history', stdhistory);
router.post('/join-queue', joinQueue);
module.exports = router;