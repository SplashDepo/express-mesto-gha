import { Router } from "express";
import { getAllCards, createCard, deleteCard, likeCard, dislikeCard } from '../Controllers/cardController.js';

const router = Router();

router.get('/', getAllCards);
router.post('/', createCard);
router.delete('/:id', deleteCard);
router.put('/:id/likes', likeCard)
router.delete('/:id/likes', dislikeCard)

export default router;
