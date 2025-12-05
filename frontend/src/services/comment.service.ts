import { api } from '@/lib/api';

export interface Comment {
  id: string;
  content: string;
  cardId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  };
}

export interface CreateCommentData {
  content: string;
}

export interface UpdateCommentData {
  content: string;
}

export const commentService = {
  async getComments(cardId: string): Promise<Comment[]> {
    const response = await api.get<Comment[]>(`/comments/card/${cardId}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to fetch comments');
  },

  async createComment(cardId: string, data: CreateCommentData): Promise<Comment> {
    const response = await api.post<Comment>(`/comments/card/${cardId}`, data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to create comment');
  },

  async updateComment(id: string, data: UpdateCommentData): Promise<Comment> {
    const response = await api.put<Comment>(`/comments/${id}`, data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to update comment');
  },

  async deleteComment(id: string): Promise<void> {
    const response = await api.delete<void>(`/comments/${id}`);
    if (!response.success) {
      throw new Error('Failed to delete comment');
    }
  },
};

