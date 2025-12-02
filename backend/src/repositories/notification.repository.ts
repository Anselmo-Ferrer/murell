import { prisma } from '../config/database';
import { Notification } from '@prisma/client';

export class NotificationRepository {
  async findByUserId(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly && { read: false }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(data: {
    type: string;
    title: string;
    message: string;
    userId: string;
  }): Promise<Notification> {
    return prisma.notification.create({
      data,
    });
  }

  async markAsRead(id: string): Promise<Notification> {
    return prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.notification.delete({
      where: { id },
    });
  }
}

export const notificationRepository = new NotificationRepository();

