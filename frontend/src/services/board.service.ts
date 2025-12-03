import { api } from '@/lib/api';

export interface Board {
  id: string;
  title: string;
  description?: string | null;
  color?: string | null;
  category?: string | null;
  isPublic: boolean;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  };
  members?: Array<{
    id: string;
    role: string;
    joinedAt: string;
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string | null;
    };
  }>;
}

export interface CreateBoardData {
  title: string;
  description?: string;
  color?: string;
  category?: string;
  isPublic?: boolean;
}

export interface UpdateBoardData {
  title?: string;
  description?: string;
  color?: string;
  category?: string;
}

export const boardService = {
  async getBoards(): Promise<Board[]> {
    const response = await api.get<Board[]>('/boards');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to fetch boards');
  },

  async getBoardById(id: string): Promise<Board> {
    const response = await api.get<Board>(`/boards/${id}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to fetch board');
  },

  async createBoard(data: CreateBoardData): Promise<Board> {
    const response = await api.post<Board>('/boards', data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to create board');
  },

  async updateBoard(id: string, data: UpdateBoardData): Promise<Board> {
    const response = await api.put<Board>(`/boards/${id}`, data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to update board');
  },

  async deleteBoard(id: string): Promise<void> {
    const response = await api.delete<void>(`/boards/${id}`);
    if (!response.success) {
      throw new Error('Failed to delete board');
    }
  },

  async addMember(boardId: string, userId: string, role: string): Promise<void> {
    const response = await api.post<void>(`/boards/${boardId}/members`, {
      userId,
      role,
    });
    if (!response.success) {
      throw new Error('Failed to add member');
    }
  },

  async removeMember(boardId: string, userId: string): Promise<void> {
    const response = await api.delete<void>(`/boards/${boardId}/members/${userId}`);
    if (!response.success) {
      throw new Error('Failed to remove member');
    }
  },
};

