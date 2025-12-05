import { prisma } from '../config/database';
import { Column } from '@prisma/client';
import { ColumnWithCards } from '../types';

export class ColumnRepository {
  async findById(id: string): Promise<ColumnWithCards | null> {
    return prisma.column.findUnique({
      where: { id },
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
    });
  }

  async findByBoardId(boardId: string): Promise<ColumnWithCards[]> {
    return prisma.column.findMany({
      where: { boardId },
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
    });
  }

  async create(data: { title: string; boardId: string; position?: number }): Promise<Column> {
    const maxPosition = await this.getMaxPosition(data.boardId);
    return prisma.column.create({
      data: {
        ...data,
        position: data.position ?? maxPosition + 1,
      },
    });
  }

  async update(id: string, data: Partial<{ title: string; position: number }>): Promise<Column> {
    return prisma.column.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.column.delete({
      where: { id },
    });
  }

  async reorder(columnIds: string[]): Promise<void> {
    await Promise.all(
      columnIds.map((id, index) =>
        prisma.column.update({
          where: { id },
          data: { position: index },
        })
      )
    );
  }

  private async getMaxPosition(boardId: string): Promise<number> {
    const result = await prisma.column.aggregate({
      where: { boardId },
      _max: { position: true },
    });
    return result._max.position ?? -1;
  }
}

export const columnRepository = new ColumnRepository();

