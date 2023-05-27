import User from "../models/user.js";
import {
  ERROR_INACCURATE_DATA,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
  INTERNAL_SERVER_MESSAGE,
  MISSING_USER_ID_MESSAGE
} from '../errors/errors.js'

const getAllUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() =>
      res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: INTERNAL_SERVER_MESSAGE }));
};

const getUserById = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (user) return res.send({ data: user });
      return res.status(ERROR_NOT_FOUND).send({ message: MISSING_USER_ID_MESSAGE });
    })
    .catch((err) =>
      err.name === 'CastError'
        ? res
          .status(ERROR_INACCURATE_DATA)
          .send({ message: 'Передан некорректный id' })
        : res
          .status(ERROR_INTERNAL_SERVER)
          .send({ message: INTERNAL_SERVER_MESSAGE }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      err.name === 'ValidationError'
        ? res
          .status(ERROR_INACCURATE_DATA)
          .send({ message: 'Переданы некорректные данные при создании пользователя' })
        : res
          .status(ERROR_INTERNAL_SERVER)
          .send({ message: INTERNAL_SERVER_MESSAGE }));
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const { _id: userId } = req.user;
  User
    .findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true, upsert: false })
    .then((user) => {
      if (user) return res.send({ data: user });
      return res.status(ERROR_NOT_FOUND).send({ message: MISSING_USER_ID_MESSAGE });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }

      if (err.name === 'CastError') {
        return res.status(ERROR_NOT_FOUND).send({ message: MISSING_USER_ID_MESSAGE });
      }

      return res.status(ERROR_INTERNAL_SERVER).send({ message: INTERNAL_SERVER_MESSAGE });

    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id: userId } = req.user;
  User
    .findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true, upsert: false })
    .then((user) => {
      if (user) return res.send({ data: user });
      return res.status(ERROR_NOT_FOUND).send({ message: MISSING_USER_ID_MESSAGE });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }

      if (err.name === 'CastError') {
        return res.status(ERROR_NOT_FOUND).send({ message: MISSING_USER_ID_MESSAGE });
      }

      return res.status(ERROR_INTERNAL_SERVER).send({ message: INTERNAL_SERVER_MESSAGE });

    });
};

export { getAllUsers, getUserById, createUser, updateUserInfo, updateUserAvatar };
