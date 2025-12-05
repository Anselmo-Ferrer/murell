import { api } from '@/lib/api';
import { Card } from './column.service';

export interface CreateCardData {
  title: string;
  description?: string;
  image?: string;
  position?: number;
}

export interface UpdateCardData {
  title?: string;
  description?: string;
  position?: number;
}

export interface MoveCardData {
  columnId: string;
  position: number;
}

export interface AddLabelData {
  name: string;
  color: string;
}

export const cardService = {
  async getCards(columnId: string): Promise<Card[]> {
    const response = await api.get<Card[]>(`/cards/column/${columnId}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to fetch cards');
  },

  async getCardById(id: string): Promise<Card> {
    const response = await api.get<Card>(`/cards/${id}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to fetch card');
  },

  async createCard(columnId: string, data: CreateCardData): Promise<Card> {
    const response = await api.post<Card>(`/cards/column/${columnId}`, data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to create card');
  },

  async updateCard(id: string, data: UpdateCardData): Promise<Card> {
    const response = await api.put<Card>(`/cards/${id}`, data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to update card');
  },

  async deleteCard(id: string): Promise<void> {
    const response = await api.delete<void>(`/cards/${id}`);
    if (!response.success) {
      throw new Error('Failed to delete card');
    }
  },

  async moveCard(id: string, data: MoveCardData): Promise<Card> {
    const response = await api.post<Card>(`/cards/${id}/move`, data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to move card');
  },

  async addLabel(id: string, data: AddLabelData): Promise<Card> {
    const response = await api.post<Card>(`/cards/${id}/labels`, data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to add label');
  },

  async removeLabel(id: string, labelId: string): Promise<Card> {
    const response = await api.delete<Card>(`/cards/${id}/labels/${labelId}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to remove label');
  },

  async toggleLike(id: string): Promise<{ liked: boolean; likes: number }> {
    const response = await api.post<{ liked: boolean; likes: number }>(`/cards/${id}/like`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to toggle like');
  },
};

