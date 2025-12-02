import { prisma } from '../config/database';
import { Board, BoardMember, Column } from '@prisma/client';
import { BoardWithRelations, ColumnWithCards } from '../types';

export class BoardRepository {
  async findById(id: string): Promise<BoardWithRelations | null> {
    return prisma.board.findUnique({
      where: { id },
      include: {
        creator: true,
        members: {
          include: {
            user: true,
          },
        },
        columns: {
          include: {
            cards: {
              include: {
                labels: {
                  include: {
                    label: true,
                  },
                },
                members: {
                  include: {
                    user: true,
                  },
                },
                _count: {
                  select: {
                    comments: true,
                    likes: true,
                    attachments: true,
                  },
                },
              },
              orderBy: {
                position: 'asc',
              },
            },
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });
  }

  async findByUserId(userId: string): Promise<Board[]> {
    return prisma.board.findMany({
      where: {
        OR: [
          { creatorId: userId },
          {
            members: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async create(data: {
    title: string;
    description?: string;
    color?: string;
    category?: string;
    creatorId: string;
    isPublic?: boolean;
  }): Promise<Board> {
    return prisma.board.create({
      data: {
        ...data,
        members: {
          create: {
            userId: data.creatorId,
            role: 'owner',
          },
        },
      },
    });
  }

  async update(id: string, data: Partial<{ title: string; description: string; color: string; category: string }>): Promise<Board> {
    return prisma.board.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.board.delete({
      where: { id },
    });
  }

  async addMember(boardId: string, userId: string, role: string = 'member'): Promise<BoardMember> {
    return prisma.boardMember.create({
      data: {
        boardId,
        userId,
        role,
      },
      include: {
        user: true,
      },
    });
  }

  async removeMember(boardId: string, userId: string): Promise<void> {
    await prisma.boardMember.delete({
      where: {
        userId_boardId: {
          userId,
          boardId,
        },
      },
    });
  }

  async isMember(boardId: string, userId: string): Promise<boolean> {
    const member = await prisma.boardMember.findUnique({
      where: {
        userId_boardId: {
          userId,
          boardId,
        },
      },
    });
    return !!member;
  }

  async getMemberRole(boardId: string, userId: string): Promise<string | null> {
    const member = await prisma.boardMember.findUnique({
      where: {
        userId_boardId: {
          userId,
          boardId,
        },
      },
    });
    return member?.role || null;
  }
}

export const boardRepository = new BoardRepository();

