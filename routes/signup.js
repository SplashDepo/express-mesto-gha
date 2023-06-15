import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { URL_REGEX } from '../utils/constant.js';
import { createUser } from '../Controllers/userController.js';

const router = Router();

router.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(URL_REGEX),
  }),
}), createUser);

export default router;
