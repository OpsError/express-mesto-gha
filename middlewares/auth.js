const jwt = require('jsonwebtoken');
const InvalidAuth = require('../errors/invalid-auth-err');

const SECRET_KEY = 'super-key';

module.exports = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new InvalidAuth('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payloud;

  try {
    payloud = jwt.verify(token, SECRET_KEY);
  } catch {
    throw new InvalidAuth('Необходима авторизация');
  }

  req.user = payloud;
  next();
}