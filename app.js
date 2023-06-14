import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import routerUser from './routes/users.js';
import routerCard from './routes/cards.js';
import { loginUser, createUser } from './Controllers/userController.js';
import NotFoundError from './errors/NotFoundError.js';
import { errors } from 'celebrate';
import errorHandler from './middlewares/errorHandler.js';
import auth from './middlewares/auth.js';

const { PORT = 3000, URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(URL)
  .then(() => console.log('Connect DB'))
  .catch((err) => console.log(err));

const app = express();
app.use(helmet());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/signup', createUser);
app.post('/signin', loginUser);

app.use(auth);

app.use('/users', routerUser);
app.use('/cards', routerCard);

app.use((req, res, next) => next(new NotFoundError('Страницы по запрошенному URL не существует')));

app.use(errors());
app.use(errorHandler);

app.listen(PORT);
