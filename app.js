const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');
const NotFound = require('./errors/not-found-error');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// const { responseCors } = require('./middlewares/processingCORS');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());

// app.use(responseCors);

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(auth, (req, res, next) => {
  next(new NotFound('Запрашиваемая страница не найдена'));
});

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
});

app.listen(3000, () => {
  console.log('Server running');
});
