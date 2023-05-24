const router = require('express').Router();
const {creacteUser, getUserInfo, getAllUsers, patchProfile, patchAvatar} = require('../controllers/users');

router.get('/', getAllUsers);

router.get('/:userId', getUserInfo);

router.post('/', creacteUser);

router.patch('/me', patchProfile);

router.patch('/me/avatar', patchAvatar);

module.exports = router;