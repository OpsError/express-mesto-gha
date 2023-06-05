const User = require('../models/user');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const InvalidData = require('../errors/invalid-data-err');
const NotFound = require('../errors/not-found-error');
const InvalidAuth = require('../errors/invalid-auth-err');
const DuplicateError = require('../errors/duplicate-err');

const MONGODB_ERROR = 11000;
const SECRET_KEY = 'super-key';

// авторизация
const login = (req, res, next) => {
  const {email, password} = req.body;

  if (!validator.isEmail(email)) {
    throw new InvalidData('Invalid Data');
  }

  User.findOne({email}).select('+password')
  .orFail( () =>{
      throw new InvalidAuth('Неверный логин или пароль')
  })
  .then(user => {
    if (!user) {
      throw new InvalidAuth('Неверный логин или пароль');
    }

    return Promise.all([user, bcrypt.compare(password, user.password)]);
  })
  .then(([user, matched])=> {
    if (!matched) {
      throw new InvalidAuth('Неверный логин или пароль');
    }

    const token = jwt.sign({ _id: user._id }, SECRET_KEY, {expiresIn: '7d'});
    res.status(200).send({data: token});
  })
  .catch(next);

}

// создание нового пользователя
const createUser = (req, res, next) => {
  const {name, about, avatar, email, password} = req.body;

  if (!validator.isEmail(email)) {
    throw new InvalidData('Invalid Data');
  }


  bcrypt.hash(password, 10)
  .then(hash => User.create({name, about, avatar, email, password: hash}))
  .then(user => res.send({
    name: user.name,
    about: user.about,
    avatar: user.avatar,
    email: user.email
  }))
  .catch(err => {
    if (err.code === MONGODB_ERROR) {
      next(new DuplicateError('Такая почта уже существует'));
    }
    if (err.name === 'ValidationError') {
      next(new InvalidData('Invalid Data'));
    }
  });
}

// данные текущего пользователя
const getCurrentInfo = (req, res, next) => {
  if (!req.user._id) {
    throw new InvalidAuth('Необходима авторизация');
  }

  User.findById(req.user._id)
  .orFail(() => {
    throw new NotFound('User Not Found');
  })
  .then(user => res.status(200).send({
    name: user.name,
    about: user.about,
    avatar: user.avatar,
    email: user.email
  }))
  .catch(next);
}

// информация о пользователе
const getUserInfo = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    throw new InvalidData('Invalid Data');
  }
  User.findById(req.params.userId)
  .orFail()
  .then(user => res.send({data: user}))
  .catch(err => {
    if (err.name === 'DocumentNotFoundError') {
      next(new NotFound('User Not Found'));
    }
    next(err);
  });
}

// информация о всех пользователях
const getAllUsers = (req, res, next) => {
  User.find({})
  .then(user => res.send({data: user}))
  .catch(next);
}

//  обновить профиль
const patchProfile = (req, res, next) => {
  const {name, about} = req.body;
  if (!name || !about) {
    throw new InvalidData('Invalid Data');
  }
  User.findByIdAndUpdate(req.user._id, {name, about}, { returnDocument: "after" })
  .orFail()
  .then(user => res.send({data: user}))
  .catch(err => {
    if (err.name === 'ValidationError') {
      next(new InvalidData('Invalid Data'));
    }
  });
}

// обновить аватарку
const patchAvatar = (req, res, next) => {
  const {avatar} = req.body;
  if (!avatar) {
    throw new InvalidData('Invalid Data');
  }

  User.findByIdAndUpdate(req.user._id, {avatar}, { returnDocument: "after" })
  .then(user => res.send({data: user}))
  .catch(err => {
    if (err.name === 'ValidationError') {
      next(new InvalidData('Invalid Data'));
    }
  });
}

module.exports = {
  createUser,
  getUserInfo,
  getAllUsers,
  patchProfile,
  patchAvatar,
  login,
  getCurrentInfo
}