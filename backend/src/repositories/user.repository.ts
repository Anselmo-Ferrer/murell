import { prisma } from '../config/database';
import { User } from '@prisma/client';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: { email: string; name: string; password: string; avatar?: string; bio?: string }): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async update(id: string, data: Partial<{ name: string; avatar: string; bio: string; password: string }>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }
}

export const userRepository = new UserRepository();

