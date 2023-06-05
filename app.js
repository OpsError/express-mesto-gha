const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes/index');
const {errors} = require('celebrate');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());

app.use(router);

app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемая страница не найдена' });
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  console.log(err);

  res.status(statusCode).send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message
    });
});

app.listen(3000, () => {
  console.log('Server running');
});
