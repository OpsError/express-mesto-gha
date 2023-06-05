const router = require('express').Router();
const {validateCardBody} = require('../middlewares/validate');
const {getAllCards, postCard, deleteCard, putLike, deleteLike} = require('../controllers/cards');

router.get('/', getAllCards);

router.post('/', validateCardBody, postCard);

router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', putLike);

router.delete('/:cardId/likes', deleteLike);

module.exports = router;