const router = require('express').Router();
const {getCurrentInfo, getUserInfo, getAllUsers, patchProfile, patchAvatar } = require('../controllers/users');

router.get('/', getAllUsers);

router.get('/:userId', getUserInfo);

router.get('/me',  getCurrentInfo);

router.patch('/me', patchProfile);

router.patch('/me/avatar', patchAvatar);

module.exports = router;