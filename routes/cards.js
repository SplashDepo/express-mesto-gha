import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { URL_REGEX, ID_REGEX } from '../utils/constant.js';
import {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../Controllers/cardController.js';

const router = Router();

router.get('/', getAllCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(URL_REGEX),
  }),
}), createCard);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().regex(ID_REGEX),
  }),
}), deleteCard);

router.put('/:id/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().regex(ID_REGEX),
  }),
}), likeCard);
router.delete('/:id/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().regex(ID_REGEX),
  }),
}), dislikeCard);

export default router;
