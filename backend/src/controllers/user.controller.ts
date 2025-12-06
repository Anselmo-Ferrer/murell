import { Response } from 'express';
import { userService } from '../services/user.service';
import { AuthRequest } from '../types';

export class UserController {
  async getProfile(req: AuthRequest, res: Response) {
    const userId = req.user!.id;
    const profile = await userService.getProfile(userId);
    res.json({
      success: true,
      data: profile,
    });
  }

  async updateProfile(req: AuthRequest, res: Response) {
    const userId = req.user!.id;
    const { name, avatar, bio } = req.body;
    const profile = await userService.updateProfile(userId, { name, avatar, bio });
    res.json({
      success: true,
      data: profile,
    });
  }

  async updatePassword(req: AuthRequest, res: Response) {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;
    await userService.updatePassword(userId, currentPassword, newPassword);
    res.json({
      success: true,
      message: 'Senha atualizada com sucesso',
    });
  }
}

export const userController = new UserController();

