import { Router } from 'express';
import { cardController } from '../controllers/card.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate, schemas } from '../middlewares/validation.middleware';

const router = Router();

router.use(authenticate);

router.get('/column/:columnId', cardController.getCards.bind(cardController));
router.get('/:id', cardController.getCardById.bind(cardController));
router.post('/column/:columnId', validate(schemas.card.create), cardController.createCard.bind(cardController));
router.put('/:id', validate(schemas.card.update), cardController.updateCard.bind(cardController));
router.delete('/:id', cardController.deleteCard.bind(cardController));
router.post('/:id/move', cardController.moveCard.bind(cardController));
router.post('/:id/labels', cardController.addLabel.bind(cardController));
router.delete('/:id/labels/:labelId', cardController.removeLabel.bind(cardController));
router.post('/:id/like', cardController.toggleLike.bind(cardController));

export default router;

