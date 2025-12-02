import { Router } from 'express';
import { columnController } from '../controllers/column.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate, schemas } from '../middlewares/validation.middleware';

const router = Router();

router.use(authenticate);

router.get('/board/:boardId', columnController.getColumns.bind(columnController));
router.post('/board/:boardId', validate(schemas.column.create), columnController.createColumn.bind(columnController));
router.put('/:id', validate(schemas.column.update), columnController.updateColumn.bind(columnController));
router.delete('/:id', columnController.deleteColumn.bind(columnController));
router.post('/board/:boardId/reorder', columnController.reorderColumns.bind(columnController));

export default router;

