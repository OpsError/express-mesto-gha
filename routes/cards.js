const router = require('express').Router();

const {validateCardBody} = require('../middlewares/validate');
const {getAllCards, postCard, deleteCard, putLike, deleteLike} = require('../controllers/cards');

router.get('/', getAllCards);

router.post('/', validateCardBody, postCard);

router.delete('/:cardId/likes', deleteLike);

router.put('/:cardId/likes', putLike);

router.delete('/:cardId', deleteCard);

module.exports = router;