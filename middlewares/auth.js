const jwt = require('jsonwebtoken');
const InvalidAuth = require('../errors/invalid-auth-err');

const SECRET_KEY = 'super-key';

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new InvalidAuth('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payloud;

  if (jwt.verify(token, SECRET_KEY)) {
    payloud = jwt.verify(token, SECRET_KEY);
  } else {
    throw new InvalidAuth('Необходима авторизация');
  }

  req.user = payloud;
  next();
};
