const {celebrate, Joi} = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const urlPattern = /(https?):\/\/(w{3}\.)?(\w*\/*\W*\d*)*\./;

const validateSignUp = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string().uri().pattern(new RegExp(urlPattern)).default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8)
  }).unknown(true)
});

const validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8)
  }).unknown(true)
});

const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri().pattern(new RegExp(urlPattern))
  }).unknown(true)
});

const validatePatchProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30)
  }).unknown(true)
});

const validatePatchAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri().pattern(new RegExp(urlPattern))
  })
});

const validateParamsUser = celebrate({
  params: Joi.object().keys({
    userId: Joi.objectId()
  })
});

module.exports = {
  validateSignUp,
  validateSignIn,
  validateCardBody,
  validatePatchProfile,
  validatePatchAvatar,
  validateParamsUser,
}