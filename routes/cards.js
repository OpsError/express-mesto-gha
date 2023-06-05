const router = require('express').Router();
const {validateCardBody, validateCardParams} = require('../middlewares/validate');
const {getAllCards, postCard, deleteCard, putLike, deleteLike} = require('../controllers/cards');

router.get('/', getAllCards);

router.post('/', validateCardBody, postCard);

router.delete('/:cardId', validateCardParams, deleteCard);

router.put('/:cardId/likes', validateCardParams, putLike);

router.delete('/:cardId/likes', validateCardParams, deleteLike);

module.exports = router;