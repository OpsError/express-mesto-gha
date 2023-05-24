const Card = require('../models/card');
const mongoose = require('mongoose');

const ERROR_CODES = {
  CREATED: 201,
  INVALID_DATA: 400,
  NOT_FOUND: 404,
  DEFAULT_ERROR: 500
}

// получение всех карточек
const getAllCards = (req, res) => {
  Card.find({})
    .then((user) => res.status(ERROR_CODES.CREATED).send({ data: user }))
    .catch((err) => {
      res.status(ERROR_CODES.DEFAULT_ERROR).send({
        message: 'Internal Server Error',
      });
    });
};

// новая карточка
const postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({name, link, owner})
  .then(user => res.status(ERROR_CODES.CREATED).send({data: user}))
  .catch(err => {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODES.INVALID_DATA).send({
        message: 'Invalid Data'
      });
      return;
    }
    res.status(ERROR_CODES.DEFAULT_ERROR).send({
      message: 'Internal Server Error',
    });
  });
}

// удалить карточку
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
  .then(user => res.send({data: user}))
  .catch(err => {
    if (err.name === 'CastError') {
      res.status(ERROR_CODES.NOT_FOUND).send({
        message: "Card Not Found"
      });
      return;
    }
    res.status(ERROR_CODES.DEFAULT_ERROR).send({
      message: 'Internal Server Error'
    })
  });
}

// поставить лайк
const putLike = (req, res) => {
  if(mongoose.Types.ObjectId.isValid(req.user._id)) {
    res.status(ERROR_CODES.INVALID_DATA).send({
      message: 'Invalid Data'
    });
    return;
  }
  Card.findByIdAndUpdate(req.params.cardId, {
    $addToSet: {likes: req.user._id}
  }, {new: true})
  .then(user => res.send({data: user}))
  .catch(err => {
    if(mongoose.Types.ObjectId.isValid(req.params.cardId)) {
      res.status(ERROR_CODES.NOT_FOUND).send({
        message: 'Card Not Found'
      });
      return;
    }
    res.status(ERROR_CODES.DEFAULT_ERROR).send({
      message: 'Internal Server Error'
    })
  });
}

const deleteLike = (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.user._id)) {
    res.status(ERROR_CODES.INVALID_DATA).send({
      message: 'Invalid Data'
    });
    return;
  }

  Card.findByIdAndUpdate(req.params.cardId, {
    $pull: {likes: req.user._id}
  }, {new: true})
  .orFail(() => {
    throw new Error('NotFound');
  })
  .then((user) => res.send({data: user}))
  .catch(err => {
    if(mongoose.Types.ObjectId.isValid(req.params.cardId)) {
      res.status(ERROR_CODES.NOT_FOUND).send({
        message: 'Card Not Found'
      });
      return;
    }
    res.status(ERROR_CODES.DEFAULT_ERROR).send({
      message: 'Internal Server Error'
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