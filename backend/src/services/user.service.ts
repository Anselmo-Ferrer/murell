import { userRepository } from '../repositories/user.repository';
import { NotFoundError } from '../utils/errors';

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
}

export const userService = new UserService();

