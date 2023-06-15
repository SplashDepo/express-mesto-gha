import Card from '../models/card.js';

import NotFoundError from '../errors/NotFoundError.js';
import InaccurateDataError from '../errors/InaccurateDataError.js';
import ForbiddenError from '../errors/ForbiddenError.js';

const getAllCards = (req, res, next) => {
  Card
    .find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.status(200).send({ data: cards });
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { userId: ownerId } = req.user;
  console.log(req.user);
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
    .findById({ _id: cardId })
    .orFail(() => {
      throw new NotFoundError('Данные по указанному id не найдены');
    })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card.owner.equals(userId)) {
        throw new ForbiddenError('нет прав');
      } else {
        Card.deleteOne(card)
          .then(() => {
            res.status(200).send({ data: card });
          })
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new InaccurateDataError('Переданы некорректные данные при добавлении лайка карточке'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.user;
  Card
    .findByIdAndUpdate(
      id,
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
        next(new InaccurateDataError('Переданы некорректные данные при добавлении лайка карточке'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.user;
  Card
    .findByIdAndUpdate(
      id,
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
