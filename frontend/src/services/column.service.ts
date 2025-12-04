import { api } from '@/lib/api';

export interface Column {
  id: string;
  title: string;
  position: number;
  boardId: string;
  createdAt: string;
  updatedAt: string;
  cards?: Card[];
}

export interface Card {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  position: number;
  columnId: string;
  createdAt: string;
  updatedAt: string;
  labels?: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  members?: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  }>;
  comments?: Array<{
    id: string;
    content: string;
    userId: string;
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string | null;
    };
  }>;
  _count?: {
    comments: number;
    likes: number;
    attachments: number;
  };
}

export interface CreateColumnData {
  title: string;
  position?: number;
}

export interface UpdateColumnData {
  title?: string;
  position?: number;
}

export interface ReorderColumnsData {
  columnIds: string[];
}

export const columnService = {
  async getColumns(boardId: string): Promise<Column[]> {
    const response = await api.get<Column[]>(`/columns/board/${boardId}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to fetch columns');
  },

  async createColumn(boardId: string, data: CreateColumnData): Promise<Column> {
    const response = await api.post<Column>(`/columns/board/${boardId}`, data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to create column');
  },

  async updateColumn(id: string, data: UpdateColumnData): Promise<Column> {
    const response = await api.put<Column>(`/columns/${id}`, data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to update column');
  },

  async deleteColumn(id: string): Promise<void> {
    const response = await api.delete<void>(`/columns/${id}`);
    if (!response.success) {
      throw new Error('Failed to delete column');
    }
  },

  async reorderColumns(boardId: string, data: ReorderColumnsData): Promise<void> {
    const response = await api.post<void>(`/columns/board/${boardId}/reorder`, data);
    if (!response.success) {
      throw new Error('Failed to reorder columns');
    }
  },
};

