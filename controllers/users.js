const User = require('../models/user');
const mongoose = require('mongoose');

const ERROR_CODES = {
  INVALID_DATA: 400,
  NOT_FOUND: 404,
  DEFAULT_ERROR: 500
}

// создание нового пользователя
const creacteUser = (req, res) => {
  const {name, about, avatar} = req.body;

  User.create({name, about, avatar})
  .then(user => res.send({data: user}))
  .catch(err => {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODES.INVALID_DATA).send({
        message: 'Invalid Data'
      });
      return;
    }
    res.status(ERROR_CODES.DEFAULT_ERROR).send({
      message: 'На сервере произошла ошибка'
    })
  });
}

// информация о пользователе
const getUserInfo = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    res.status(ERROR_CODES.INVALID_DATA).send({
      message: 'Invalid Data'
    });
    return;
  }
  User.findById(req.params.userId)
  .orFail()
  .then(user => res.send({data: user}))
  .catch(err => {
    if (err.name === 'DocumentNotFoundError') {
      res.status(ERROR_CODES.NOT_FOUND).send({message: 'User Not Found'});
      return;
    }
    res.status(ERROR_CODES.DEFAULT_ERROR).send({
      message: 'На сервере произошла ошибка',
    });
  });
}

// информация о всех пользователях
const getAllUsers = (req, res) => {
  User.find({})
  .then(user => res.send({data: user}))
  .catch(err => {
    res.status(ERROR_CODES.DEFAULT_ERROR).send({
      message: 'На сервере произошла ошибка'
    })
  });
}

//  обновить профиль
const patchProfile = (req, res) => {
  const {name, about} = req.body;
  if (!name || !about) {
    res.status(ERROR_CODES.INVALID_DATA).send({
      message: 'Invalid Data'
    });
    return;
  }
  User.findByIdAndUpdate(req.user._id, {name, about}, { returnDocument: "after" })
  .orFail()
  .then(user => res.send({data: user}))
  .catch(err => {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODES.INVALID_DATA).send({
        message: 'Invalid Data'
      });
      return;
    }
    res.status(ERROR_CODES.DEFAULT_ERROR).send({
      message: 'На сервере произошла ошибка'
    })
  });
}

// обновить аватарку
const patchAvatar = (req, res) => {
  const {avatar} = req.body;
  if (!avatar) {
    res.status(ERROR_CODES.INVALID_DATA).send({
      message: 'Invalid Data'
    });
    return;
  }

  User.findByIdAndUpdate(req.user._id, {avatar}, { returnDocument: "after" })
  .then(user => res.send({data: user}))
  .catch(err => {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODES.INVALID_DATA).send({
        message: 'Invalid Data'
      });
      return;
    }
    res.status(ERROR_CODES.DEFAULT_ERROR).send({
      message: 'На сервере произошла ошибка'
    })
  });
}

module.exports = {
  creacteUser,
  getUserInfo,
  getAllUsers,
  patchProfile,
  patchAvatar
}