const User = require('../models/user');

const ERROR_CODES = {
  CREATED: 201,
  INVALID_DATA: 400,
  NOT_FOUND: 404,
  DEFAULT_ERROR: 500
}

// создание нового пользователя
const creacteUser = (req, res) => {
  const {name, about, avatar} = req.body;

  User.create({name, about, avatar}, {runValidators: true})
  .then(user => res.status(ERROR_CODES.CREATED).send({data: user}))
  .catch(err => {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODES.INVALID_DATA).send({
        message: 'Invalid Data'
      });
      return;
    }
    res.status(ERROR_CODES.DEFAULT_ERROR).send({
      message: err.name
    })
  });
}

// информация о пользователе
const getUserInfo = (req, res) => {
  User.findById(req.params.userId)
  .then(user => res.send({data: user}))
  .catch(err => {
    if (err.name === 'CastError') {
      res.status(ERROR_CODES.NOT_FOUND).send({
        message: 'User Not Found'
      });
      return;
    }
    res.status(ERROR_CODES.DEFAULT_ERROR).send({
      message: 'Internal Server Error',
    });
  });
}

// информация о всех пользователях
const getAllUsers = (req, res) => {
  User.find({})
  .then(user => res.send({data: user}))
  .catch(err => {
    res.status(ERROR_CODES.DEFAULT_ERROR).send({
      message: 'Internal Server Error'
    })
  });
}

//  обновить профиль
const patchProfile = (req, res) => {
  const {name, about} = req.body;
  User.findByIdAndUpdate(req.user._id, {name, about}, {runValidators: true})
  .then(user => res.status(ERROR_CODES.CREATED).send({data: user}))
  .catch(err => {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODES.INVALID_DATA).send({
        message: 'Invalid Data'
      });
      return;
    }
    if (err.name === 'CastError') {
      res.status(ERROR_CODES.NOT_FOUND).send({
        message: "User Not Found"
      });
      return;
    }
    res.status(ERROR_CODES.DEFAULT_ERROR).send({
      message: 'Internal Server Error'
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

  User.findByIdAndUpdate(req.user._id, {avatar})
  .then(user => res.status(ERROR_CODES.CREATED).send({data: user}))
  .catch(err => {
    if (err.name === 'CastError') {
      res.status(ERROR_CODES.NOT_FOUND).send({
        message: "User Not Found"
      });
      return;
    }
    res.status(ERROR_CODES.DEFAULT_ERROR).send({
      message: 'Internal Server Error'
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