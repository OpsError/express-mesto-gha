const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes/index');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '646a6ac344a963a8bff0cc09',
  };

  next();
});

app.use(router);

app.listen(3000, () => {
  console.log('HELLO FUCKING WORLD');
});
