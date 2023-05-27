import { Router } from 'express';
import { getAllUsers, getUserById, createUser, updateUserInfo, updateUserAvatar } from '../Controllers/userController.js';

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

export default router;
