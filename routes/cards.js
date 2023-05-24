const router = require('express').Router();
const {getAllCards, postCard, deleteCard, putLike, deleteLike} = require('../controllers/cards');

router.get('/', getAllCards);

router.post('/', postCard);

router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', putLike);
router.delete('/:cardId/likes', deleteLike);

module.exports = router;