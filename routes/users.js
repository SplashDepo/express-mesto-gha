import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { URL_REGEX } from '../utils/constant.js';

import {
  getAllUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
  getCurrentUserInfo,
} from '../Controllers/userController.js';

const router = Router();

router.get('/', getAllUsers);
router.get('/me', getCurrentUserInfo);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUserInfo);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(URL_REGEX),
  }),
}), updateUserAvatar);

export default router;
