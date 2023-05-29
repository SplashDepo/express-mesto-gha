import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import routerUser from './routes/users.js';
import routerCard from './routes/cards.js';
import { ERROR_NOT_FOUND } from './errors/errors.js';

const { PORT = 3000, URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(URL)
  .then(() => console.log('Connect DB'))
  .catch((err) => console.log(err));

const app = express();
app.use(helmet());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '646f8aed60d1a5ef75c660a7',
  };

  next();
});

app.use('/users', routerUser);
app.use('/cards', routerCard);

app.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Страницы по запрошенному URL не существует' });
});

app.listen(PORT);
