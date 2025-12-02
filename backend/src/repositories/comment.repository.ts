import { prisma } from '../config/database';
import { Comment } from '@prisma/client';
import { CommentWithUser } from '../types';

export class CommentRepository {
  async findById(id: string): Promise<CommentWithUser | null> {
    return prisma.comment.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async findByCardId(cardId: string): Promise<CommentWithUser[]> {
    return prisma.comment.findMany({
      where: { cardId },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(data: { content: string; cardId: string; userId: string }): Promise<CommentWithUser> {
    return prisma.comment.create({
      data,
      include: {
        user: true,
      },
    });
  }

  async update(id: string, content: string): Promise<Comment> {
    return prisma.comment.update({
      where: { id },
      data: { content },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.comment.delete({
      where: { id },
    });
  }
}

export const commentRepository = new CommentRepository();

