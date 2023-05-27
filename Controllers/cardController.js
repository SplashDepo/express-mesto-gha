import Card from "../models/card.js";
import {
  ERROR_INACCURATE_DATA,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
  INTERNAL_SERVER_MESSAGE,
  MISSING_CARD_ID_MESSAGE
} from '../errors/errors.js'

const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send(err));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id: ownerId } = req.user;
  Card.create({ name, link, owner: ownerId })
    .then((cards) => res.send({ data: cards }))
    .catch((err) =>
      err.name === 'ValidationError'
        ? res
          .status(ERROR_INACCURATE_DATA)
          .send({ message: 'Переданы некорректные данные при создании карточки' })
        : res
          .status(ERROR_INTERNAL_SERVER)
          .send({ message: INTERNAL_SERVER_MESSAGE }));
};

const deleteCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndRemove(id)
    .then((user) => {
      if (user) return res.send({ data: user });
      return res.status(ERROR_NOT_FOUND).send({ message: MISSING_CARD_ID_MESSAGE });
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

const likeCard = (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: userId } },
    { new: true })
    .then((user) => {
      if (user) return res.send({ data: user });
      return res.status(ERROR_NOT_FOUND).send({ message: MISSING_CARD_ID_MESSAGE });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные для добавления лайка' });
      }

      return res.status(ERROR_INTERNAL_SERVER).send({ message: INTERNAL_SERVER_MESSAGE });
    });
}

const dislikeCard = (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  Card.findByIdAndUpdate(
    id,
    { $pull: { likes: userId } },
    { new: true })
    .then((user) => {
      if (user) return res.send({ data: user });
      return res.status(ERROR_NOT_FOUND).send({ message: MISSING_CARD_ID_MESSAGE });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(ERROR_INACCURATE_DATA).send({ message: 'Переданы некорректные данные для добавления лайка' });
      }

      return res.status(ERROR_INTERNAL_SERVER).send({ message: INTERNAL_SERVER_MESSAGE });
    });
};

export { getAllCards, createCard, deleteCard, likeCard, dislikeCard };
