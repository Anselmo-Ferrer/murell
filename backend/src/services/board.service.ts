import { boardRepository } from '../repositories/board.repository';
import { NotFoundError, ForbiddenError } from '../utils/errors';

export class BoardService {
  async getBoards(userId: string) {
    return boardRepository.findByUserId(userId);
  }

  async getBoardById(id: string, userId: string) {
    const board = await boardRepository.findById(id);
    if (!board) {
      throw new NotFoundError('Board');
    }

    // Check if user has access
    const isMember = await boardRepository.isMember(id, userId);
    const isCreator = board.creatorId === userId;

    if (!isMember && !isCreator && !board.isPublic) {
      throw new ForbiddenError('You do not have access to this board');
    }

    return board;
  }

  async createBoard(
    userId: string,
    data: {
      title: string;
      description?: string;
      color?: string;
      category?: string;
      isPublic?: boolean;
    }
  ) {
    return boardRepository.create({
      ...data,
      creatorId: userId,
    });
  }

  async updateBoard(boardId: string, userId: string, data: Partial<{ title: string; description: string; color: string; category: string }>) {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      throw new NotFoundError('Board');
    }

    const role = await boardRepository.getMemberRole(boardId, userId);
    if (board.creatorId !== userId && role !== 'admin') {
      throw new ForbiddenError('You do not have permission to update this board');
    }

    return boardRepository.update(boardId, data);
  }

  async deleteBoard(boardId: string, userId: string) {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      throw new NotFoundError('Board');
    }

    if (board.creatorId !== userId) {
      throw new ForbiddenError('Only the board creator can delete it');
    }

    await boardRepository.delete(boardId);
  }

  async addMember(boardId: string, userId: string, memberUserId: string, role: string = 'member') {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      throw new NotFoundError('Board');
    }

    const userRole = await boardRepository.getMemberRole(boardId, userId);
    if (board.creatorId !== userId && userRole !== 'admin') {
      throw new ForbiddenError('You do not have permission to add members');
    }

    return boardRepository.addMember(boardId, memberUserId, role);
  }

  async removeMember(boardId: string, userId: string, memberUserId: string) {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      throw new NotFoundError('Board');
    }

    const userRole = await boardRepository.getMemberRole(boardId, userId);
    if (board.creatorId !== userId && userRole !== 'admin') {
      throw new ForbiddenError('You do not have permission to remove members');
    }

    if (board.creatorId === memberUserId) {
      throw new ForbiddenError('Cannot remove the board creator');
    }

    await boardRepository.removeMember(boardId, memberUserId);
  }
}

export const boardService = new BoardService();

