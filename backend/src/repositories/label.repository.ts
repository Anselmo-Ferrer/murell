import { prisma } from '../config/database';
import { Label } from '@prisma/client';

export class LabelRepository {
  async findOrCreate(name: string, color: string): Promise<Label> {
    return prisma.label.upsert({
      where: {
        name_color: {
          name,
          color,
        },
      },
      create: {
        name,
        color,
      },
      update: {},
    });
  }

  async findAll(): Promise<Label[]> {
    return prisma.label.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findById(id: string): Promise<Label | null> {
    return prisma.label.findUnique({
      where: { id },
    });
  }
}

export const labelRepository = new LabelRepository();

