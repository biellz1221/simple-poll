const express = require('express');
const auth = require('../middlewares/auth');

const UserController = require('../controllers/UserController');
const PollController = require('../controllers/PollController');

let router = express.Router();

// Rotas de Usuário - User Routes

router.post('/user/new', UserController.create);
router.post('/user/login', UserController.login);
router.post('/user/logout', auth, UserController.logout);
router.post('/user/logoutall', auth, UserController.logoutAll);
router.delete('/user/delete', UserController.deleteUser);

// Rotas de Enquete - Poll Routes

router.get('/poll/all', auth, PollController.pollsByUser);
router.get('/poll/:pid', PollController.pollById);
router.post('/poll/new', auth, PollController.create);
router.post('/poll/:pid/vote/:optionid', PollController.vote);
router.patch('/poll/:id/edit', auth, PollController.edit);
router.delete('/poll/:pid', auth, PollController.deletePoll);

module.exports = router;
