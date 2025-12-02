import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import boardRoutes from './board.routes';
import columnRoutes from './column.routes';
import cardRoutes from './card.routes';
import commentRoutes from './comment.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/boards', boardRoutes);
router.use('/columns', columnRoutes);
router.use('/cards', cardRoutes);
router.use('/comments', commentRoutes);

export default router;

