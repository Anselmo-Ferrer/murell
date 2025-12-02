import { Router } from 'express';
import { commentController } from '../controllers/comment.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate, schemas } from '../middlewares/validation.middleware';

const router = Router();

router.use(authenticate);

router.get('/card/:cardId', commentController.getComments.bind(commentController));
router.post('/card/:cardId', validate(schemas.comment.create), commentController.createComment.bind(commentController));
router.put('/:id', validate(schemas.comment.update), commentController.updateComment.bind(commentController));
router.delete('/:id', commentController.deleteComment.bind(commentController));

export default router;

