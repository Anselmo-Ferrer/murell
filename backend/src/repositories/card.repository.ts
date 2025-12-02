import { prisma } from '../config/database';
import { Card } from '@prisma/client';
import { CardWithRelations } from '../types';

export class CardRepository {
  async findById(id: string): Promise<CardWithRelations | null> {
    return prisma.card.findUnique({
      where: { id },
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
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
        attachments: true,
        _count: {
          select: {
            comments: true,
            likes: true,
            attachments: true,
          },
        },
      },
    });
  }

  async findByColumnId(columnId: string): Promise<CardWithRelations[]> {
    return prisma.card.findMany({
      where: { columnId },
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
    });
  }

  async create(data: {
    title: string;
    description?: string;
    image?: string;
    columnId: string;
    position?: number;
  }): Promise<Card> {
    const maxPosition = await this.getMaxPosition(data.columnId);
    return prisma.card.create({
      data: {
        ...data,
        position: data.position ?? maxPosition + 1,
      },
    });
  }

  async update(id: string, data: Partial<{ title: string; description: string; image: string; position: number }>): Promise<Card> {
    return prisma.card.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.card.delete({
      where: { id },
    });
  }

  async move(cardId: string, columnId: string, position: number): Promise<Card> {
    return prisma.card.update({
      where: { id: cardId },
      data: {
        columnId,
        position,
      },
    });
  }

  async addLabel(cardId: string, labelId: string): Promise<void> {
    await prisma.cardLabel.create({
      data: {
        cardId,
        labelId,
      },
    });
  }

  async removeLabel(cardId: string, labelId: string): Promise<void> {
    await prisma.cardLabel.delete({
      where: {
        cardId_labelId: {
          cardId,
          labelId,
        },
      },
    });
  }

  async addMember(cardId: string, userId: string): Promise<void> {
    await prisma.cardMember.create({
      data: {
        cardId,
        userId,
      },
    });
  }

  async removeMember(cardId: string, userId: string): Promise<void> {
    await prisma.cardMember.delete({
      where: {
        cardId_userId: {
          cardId,
          userId,
        },
      },
    });
  }

  async toggleLike(cardId: string, userId: string): Promise<{ liked: boolean }> {
    const existing = await prisma.cardLike.findUnique({
      where: {
        cardId_userId: {
          cardId,
          userId,
        },
      },
    });

    if (existing) {
      await prisma.cardLike.delete({
        where: {
          cardId_userId: {
            cardId,
            userId,
          },
        },
      });
      return { liked: false };
    } else {
      await prisma.cardLike.create({
        data: {
          cardId,
          userId,
        },
      });
      return { liked: true };
    }
  }

  async reorder(cardIds: string[]): Promise<void> {
    await Promise.all(
      cardIds.map((id, index) =>
        prisma.card.update({
          where: { id },
          data: { position: index },
        })
      )
    );
  }

  private async getMaxPosition(columnId: string): Promise<number> {
    const result = await prisma.card.aggregate({
      where: { columnId },
      _max: { position: true },
    });
    return result._max.position ?? -1;
  }
}

export const cardRepository = new CardRepository();

