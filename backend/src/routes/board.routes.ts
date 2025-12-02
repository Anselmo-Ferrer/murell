import { Router } from 'express';
import { boardController } from '../controllers/board.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate, schemas } from '../middlewares/validation.middleware';

const router = Router();

router.use(authenticate);

router.get('/', boardController.getBoards.bind(boardController));
router.get('/:id', boardController.getBoardById.bind(boardController));
router.post('/', validate(schemas.board.create), boardController.createBoard.bind(boardController));
router.put('/:id', validate(schemas.board.update), boardController.updateBoard.bind(boardController));
router.delete('/:id', boardController.deleteBoard.bind(boardController));
router.post('/:id/members', boardController.addMember.bind(boardController));
router.delete('/:id/members/:userId', boardController.removeMember.bind(boardController));

export default router;

