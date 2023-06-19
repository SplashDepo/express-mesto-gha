import Card from '../models/card.js';

import NotFoundError from '../errors/NotFoundError.js';
import InaccurateDataError from '../errors/InaccurateDataError.js';
import ForbiddenError from '../errors/ForbiddenError.js';

const getAllCards = (req, res, next) => {
  Card
    .find({})
    .then((cards) => {
      res.status(200).send({ data: cards });
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { userId: ownerId } = req.user;
  Card
    .create({ name, link, owner: ownerId })
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

  Card
    .findById({
      _id: cardId,
    })
    .then((card) => {
      if (!card) throw new NotFoundError('Данные по указанному id не найдены');

      const { owner: cardOwnerId } = card;
      if (cardOwnerId.valueOf() !== userId) throw new ForbiddenError('Нет прав доступа');

      card.deleteOne(card)
        .then(() => res.send({ data: card }))
        .catch(next);
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { userId } = req.user;
  Card
    .findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    ).orFail(() => {
      throw new NotFoundError('Карточка с указанным id не найдена');
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InaccurateDataError('Переданы некорректные данные при добавлениилайка карточке'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { userId } = req.user;
  Card
    .findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    )
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным id не найдена');
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new InaccurateDataError('Переданы некорректные данные при снятии лайка карточки'));
      }
      return next(err);
    });
};

export {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
};
