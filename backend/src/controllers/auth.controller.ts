import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

export class AuthController {
  async register(req: Request, res: Response) {
    const { email, password, name } = req.body;
    const result = await authService.register(email, password, name);
    res.status(201).json({
      success: true,
      data: result,
    });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({
      success: true,
      data: result,
    });
  }
}

export const authController = new AuthController();

