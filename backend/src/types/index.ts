import { User, Board, Column, Card, Label, Comment, Attachment } from '@prisma/client';
import { Request } from 'express';

// Extended types with relations
import type { BoardMember } from '@prisma/client';

export type UserWithRelations = User & {
  boards?: BoardMember[];
  createdBoards?: Board[];
};

export type BoardWithRelations = Board & {
  creator?: User;
  members?: BoardMemberWithUser[];
  columns?: ColumnWithCards[];
};

export type BoardMemberWithUser = {
  id: string;
  role: string;
  joinedAt: Date;
  user: User;
};

export type ColumnWithCards = Column & {
  cards?: CardWithRelations[];
};

export type CardWithRelations = Card & {
  labels?: Label[];
  members?: User[];
  comments?: CommentWithUser[];
  likes?: CardLike[];
  attachments?: Attachment[];
  _count?: {
    comments: number;
    likes: number;
    attachments: number;
  };
};

export type CommentWithUser = Comment & {
  user: User;
};

export type CardLike = {
  id: string;
  cardId: string;
  userId: string;
};

// Request/Response types
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

