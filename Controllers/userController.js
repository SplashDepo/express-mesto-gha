import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

import UnauthorizedError from '../errors/UnauthorizedError.js';
import NotFoundError from '../errors/NotFoundError.js';
import InaccurateDataError from '../errors/InaccurateDataError.js';
import ConflictError from '../errors/ConflictError.js';

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (user) return res.status(200).send({ data: user });
      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InaccurateDataError('Передан некорректный id'));
      } else {
        next(err);
      }
    });
};

const getCurrentUserInfo = (req, res, next) => {
  const { userId } = req.user;
  User
    .findById(userId)
    .then((user) => {
      if (user) return res.status(200).send({ user });

      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InaccurateDataError('Передан некорректный id'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res
      .status(200)
      .send({
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким электронным адресом уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        next(new InaccurateDataError('Переданы некорректные данные при регистрации пользователя'));
      } else {
        next(err);
      }
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  User
    .findUserByCredentials(email, password)
    .then(({ _id: userId }) => {
      if (userId) {
        const token = jwt.sign(
          { userId },
          'some-secret-key',
          { expiresIn: '7d' },
        );

        return res.status(200).send({ _id: token });
      }

      throw new UnauthorizedError('Неправильные почта или пароль');
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  const { _id: userId } = req.user;
  User
    .findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true, upsert: false },
    )
    .then((user) => {
      if (user) return res.send({ data: user });
      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InaccurateDataError('Переданы некорректные данные при обновлении профиля пользователя'));
      } else {
        next(err);
      }
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id: userId } = req.user;
  User
    .findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true, upsert: false },
    )
    .then((user) => {
      if (user) return res.send({ data: user });
      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InaccurateDataError('Переданы некорректные данные при обновлении профиля пользователя'));
      } else {
        next(err);
      }
    });
};

export {
  getAllUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  loginUser,
  getCurrentUserInfo,
};
