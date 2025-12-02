import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate, schemas } from '../middlewares/validation.middleware';

const router = Router();

router.post('/register', validate(schemas.auth.register), authController.register.bind(authController));
router.post('/login', validate(schemas.auth.login), authController.login.bind(authController));

export default router;

