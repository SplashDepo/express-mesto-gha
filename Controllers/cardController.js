import Card from '../models/card.js';

import NotFoundError from '../errors/NotFoundError.js';
import InaccurateDataError from '../errors/InaccurateDataError.js';

const getAllCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send(err));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id: ownerId } = req.user;
  Card.create({ name, link, owner: ownerId })
    .then((cards) => res.status(201).send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InaccurateDataError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { id: cardId } = req.params;
  const { userId } = req.user;
  Card.findOneAndRemove({
    _id: cardId,
    owner: userId,
  })
    .then((user) => {
      if (user) return res.send({ data: user });
      throw new NotFoundError('Данные по указанному id не найдены');
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((user) => {
      if (user) return res.send({ data: user });
      throw new NotFoundError('Карточка с указанным id не найдена');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InaccurateDataError('Переданы некорректные данные при добавлении лайка карточке'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  Card.findByIdAndUpdate(
    id,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((user) => {
      if (user) return res.send({ data: user });
      throw new NotFoundError('Данные по указанному id не найдены');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InaccurateDataError('Переданы некорректные данные при снятии лайка карточки'));
      } else {
        next(err);
      }
    });
};

export {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
};
