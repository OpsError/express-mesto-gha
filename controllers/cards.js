const Card = require('../models/card');
const mongoose = require('mongoose');

const ERROR_CODES = {
  INVALID_DATA: 400,
  NOT_FOUND: 404,
  DEFAULT_ERROR: 500
}

// получение всех карточек
const getAllCards = (req, res) => {
  Card.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      res.status(ERROR_CODES.DEFAULT_ERROR).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

// новая карточка
const postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({name, link, owner})
  .then(user => res.send({data: user}))
  .catch(err => {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODES.INVALID_DATA).send({
        message: 'Invalid Data'
      });
      return;
    }
    res.status(ERROR_CODES.DEFAULT_ERROR).send({
      message: 'На сервере произошла ошибка',
    });
  });
}

// удалить карточку
const deleteCard = (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    res.status(ERROR_CODES.INVALID_DATA).send({
      message: 'Invalid Data'
    });
    return;
  }

  Card.findByIdAndDelete(req.params.cardId)
  .orFail()
  .then(() => res.send({message: 'Card removed'}))
  .catch(err => {
    if (err.name === 'DocumentNotFoundError') {
      res.status(ERROR_CODES.NOT_FOUND).send({message: 'Card Not Found'});
      return;
    }
    res.status(ERROR_CODES.DEFAULT_ERROR).send({
      message: 'На сервере произошла ошибка'
    })
  });
}

// поставить лайк
const putLike = (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    res.status(ERROR_CODES.INVALID_DATA).send({
      message: 'Invalid Data'
    });
    return;
  }
  Card.findByIdAndUpdate(req.params.cardId, {
    $addToSet: {likes: req.user._id}
  }, {new: true})
  .orFail()
  .then(user => res.send({data: user}))
  .catch(err => {
    if (err.name === 'DocumentNotFoundError') {
      res.status(ERROR_CODES.NOT_FOUND).send({message: 'Card Not Found'});
      return;
    }
    res.status(ERROR_CODES.DEFAULT_ERROR).send({
      message: 'На сервере произошла ошибка'
    })
  });
}

// dislike
const deleteLike = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    res.status(ERROR_CODES.INVALID_DATA).send({
      message: 'Invalid Data'
    });
    return;
  }

  Card.findByIdAndUpdate(req.params.cardId, {
    $pull: {likes: req.user._id}
  }, {new: true})
  .orFail()
  .then((user) => res.send({data: user}))
  .catch(err => {
    console.log(err.name);
    if (err.name === 'DocumentNotFoundError') {
      res.status(ERROR_CODES.NOT_FOUND).send({message: 'Card Not Found'});
      return;
    }
    res.status(ERROR_CODES.DEFAULT_ERROR).send({
      message: 'На сервере произошла ошибка'
    })
  });
}

module.exports = {
  getAllCards,
  postCard,
  deleteCard,
  putLike,
  deleteLike
}