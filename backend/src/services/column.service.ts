import { columnRepository } from '../repositories/column.repository';
import { boardRepository } from '../repositories/board.repository';
import { NotFoundError, ForbiddenError } from '../utils/errors';

export class ColumnService {
  async getColumns(boardId: string, userId: string) {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      throw new NotFoundError('Board');
    }

    const isMember = await boardRepository.isMember(boardId, userId);
    if (!isMember && board.creatorId !== userId && !board.isPublic) {
      throw new ForbiddenError('You do not have access to this board');
    }

    return columnRepository.findByBoardId(boardId);
  }

  async createColumn(boardId: string, userId: string, data: { title: string; position?: number }) {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      throw new NotFoundError('Board');
    }

    const role = await boardRepository.getMemberRole(boardId, userId);
    if (board.creatorId !== userId && role !== 'admin' && role !== 'member') {
      throw new ForbiddenError('You do not have permission to create columns');
    }

    return columnRepository.create({
      ...data,
      boardId,
    });
  }

  async updateColumn(columnId: string, userId: string, data: Partial<{ title: string; position: number }>) {
    const column = await columnRepository.findById(columnId);
    if (!column) {
      throw new NotFoundError('Column');
    }

    const board = await boardRepository.findById(column.boardId);
    if (!board) {
      throw new NotFoundError('Board');
    }

    const role = await boardRepository.getMemberRole(column.boardId, userId);
    if (board.creatorId !== userId && role !== 'admin' && role !== 'member') {
      throw new ForbiddenError('You do not have permission to update this column');
    }

    return columnRepository.update(columnId, data);
  }

  async deleteColumn(columnId: string, userId: string) {
    const column = await columnRepository.findById(columnId);
    if (!column) {
      throw new NotFoundError('Column');
    }

    const board = await boardRepository.findById(column.boardId);
    if (!board) {
      throw new NotFoundError('Board');
    }

    const role = await boardRepository.getMemberRole(column.boardId, userId);
    if (board.creatorId !== userId && role !== 'admin') {
      throw new ForbiddenError('You do not have permission to delete this column');
    }

    await columnRepository.delete(columnId);
  }

  async reorderColumns(boardId: string, userId: string, columnIds: string[]) {
    const board = await boardRepository.findById(boardId);
    if (!board) {
      throw new NotFoundError('Board');
    }

    const role = await boardRepository.getMemberRole(boardId, userId);
    if (board.creatorId !== userId && role !== 'admin' && role !== 'member') {
      throw new ForbiddenError('You do not have permission to reorder columns');
    }

    await columnRepository.reorder(columnIds);
  }
}

export const columnService = new ColumnService();

