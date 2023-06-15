import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { errors } from 'celebrate';
import routerUser from './routes/users.js';
import routerCard from './routes/cards.js';
import routerSignin from './routes/signin.js';
import routerSignup from './routes/signup.js';
import NotFoundError from './errors/NotFoundError.js';
import auth from './middlewares/auth.js';

const { PORT = 3000, URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(URL)
  .then(() => console.log('Connect DB'))
  .catch((err) => console.log(err));

const app = express();
app.use(helmet());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/signup', routerSignup);
app.use('/signin', routerSignin);

app.use(auth);

app.use('/users', routerUser);
app.use('/cards', routerCard);

app.use(errors());

app.use((req, res, next) => next(new NotFoundError('Страницы по запрошенному URL не существует')));

app.use((err, req, res, next) => {
  console.log(err);
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? 'ошибка на сервере' : message,
    });
  next();
});

app.listen(PORT);
