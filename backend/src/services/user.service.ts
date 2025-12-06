import { userRepository } from '../repositories/user.repository';
import { NotFoundError, ValidationError, UnauthorizedError } from '../utils/errors';
import { hashPassword, comparePassword } from '../utils/hash';

export class UserService {
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt,
    };
  }

  async updateProfile(userId: string, data: { name?: string; avatar?: string; bio?: string }) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    const updated = await userRepository.update(userId, data);
    return {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      avatar: updated.avatar,
      bio: updated.bio,
    };
  }

  async updatePassword(userId: string, current: string, newPass: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    const isMatch = await comparePassword(current, user.password);
    if (!isMatch) {
      throw new UnauthorizedError('Senha atual incorreta');
    }

    if (newPass.length < 6) {
      throw new ValidationError('A nova senha deve ter pelo menos 6 caracteres');
    }

    const hashedPassword = await hashPassword(newPass);
    await userRepository.update(userId, { password: hashedPassword });

    return { success: true };
  }
}

export const userService = new UserService();

