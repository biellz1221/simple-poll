const express = require('express');
const auth = require('../middlewares/auth');

const UserController = require('../controllers/UserController');
const PollController = require('../controllers/PollController');

let router = express.Router();

router.post('/user/new', UserController.create);
router.post('/user/login', UserController.login);
router.post('/user/logout', auth, UserController.logout);
router.post('/user/logoutall', auth, UserController.logoutAll);
router.delete('/user/delete', UserController.deleteUser);

module.exports = router;
