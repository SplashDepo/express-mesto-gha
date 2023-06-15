import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { loginUser } from '../Controllers/userController.js';

const router = Router();

router.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), loginUser);

export default router;
