const Card = require('../models/card');
const mongoose = require('mongoose');
const InvalidData = require('../errors/invalid-data-err');
const NotFound = require('../errors/not-found-error');
// const DefaultError = require('../errors/default-err');
const AccessError = require('../errors/access-err');


// получение всех карточек
const getAllCards = (req, res) => {
  Card.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

// новая карточка
const postCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({name, link, owner})
  .then(user => res.send({data: user}))
  .catch(err => {
    if (err.name === 'ValidationError') {
      next(new InvalidData('Invalid Data'));
    }
    next(err);
  });
}

// удалить карточку
const deleteCard = (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    throw new InvalidData('Invalid Data');
  }

  Card.findById(req.params.cardId)
  .orFail(() => {
    throw new NotFound('Card Not Found');
  })
  .then((card)=> {
    if (!card.owner === req.user._id) {
      throw new AccessError('Нет прав доступа');
    }

    Card.deleteOne({_id: req.params.cardId})
    .orFail(() => {
      throw new NotFound('Card Not Found');
    })
    .then(() => res.send({message: 'Card removed'}))
    .catch(next);
  })
  .catch(next);
}

// поставить лайк
const putLike = (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    throw new InvalidData('Invalid Data');
  }
  Card.findByIdAndUpdate(req.params.cardId, {
    $addToSet: {likes: req.user._id}
  }, {new: true})
  .orFail()
  .then(user => res.send({data: user}))
  .catch(err => {
    if (err.name === 'DocumentNotFoundError') {
      new(new NotFound('Card Not Found'));
    }
    next(err);
  });
}

// dislike
const deleteLike = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    throw new InvalidData('Invalid Data');
  }

  Card.findByIdAndUpdate(req.params.cardId, {
    $pull: {likes: req.user._id}
  }, {new: true})
  .orFail()
  .then((user) => res.send({data: user}))
  .catch(err => {
    if (err.name === 'DocumentNotFoundError') {
      next( new NotFound('Card Not Found'));
    }
    next(err);
  });
}

module.exports = {
  getAllCards,
  postCard,
  deleteCard,
  putLike,
  deleteLike
}