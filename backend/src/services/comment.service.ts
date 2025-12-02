import { commentRepository } from '../repositories/comment.repository';
import { cardRepository } from '../repositories/card.repository';
import { columnRepository } from '../repositories/column.repository';
import { boardRepository } from '../repositories/board.repository';
import { NotFoundError, ForbiddenError } from '../utils/errors';

export class CommentService {
  async getComments(cardId: string, userId: string) {
    const card = await cardRepository.findById(cardId);
    if (!card) {
      throw new NotFoundError('Card');
    }

    const column = await columnRepository.findById(card.columnId);
    if (!column) {
      throw new NotFoundError('Column');
    }

    const board = await boardRepository.findById(column.boardId);
    if (!board) {
      throw new NotFoundError('Board');
    }

    const isMember = await boardRepository.isMember(column.boardId, userId);
    if (!isMember && board.creatorId !== userId && !board.isPublic) {
      throw new ForbiddenError('You do not have access to this card');
    }

    return commentRepository.findByCardId(cardId);
  }

  async createComment(cardId: string, userId: string, content: string) {
    const card = await cardRepository.findById(cardId);
    if (!card) {
      throw new NotFoundError('Card');
    }

    const column = await columnRepository.findById(card.columnId);
    if (!column) {
      throw new NotFoundError('Column');
    }

    const board = await boardRepository.findById(column.boardId);
    if (!board) {
      throw new NotFoundError('Board');
    }

    const isMember = await boardRepository.isMember(column.boardId, userId);
    if (!isMember && board.creatorId !== userId && !board.isPublic) {
      throw new ForbiddenError('You do not have permission to comment on this card');
    }

    return commentRepository.create({
      content,
      cardId,
      userId,
    });
  }

  async updateComment(commentId: string, userId: string, content: string) {
    const comment = await commentRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundError('Comment');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenError('You can only update your own comments');
    }

    return commentRepository.update(commentId, content);
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await commentRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundError('Comment');
    }

    const card = await cardRepository.findById(comment.cardId);
    if (!card) {
      throw new NotFoundError('Card');
    }

    const column = await columnRepository.findById(card.columnId);
    if (!column) {
      throw new NotFoundError('Column');
    }

    const board = await boardRepository.findById(column.boardId);
    if (!board) {
      throw new NotFoundError('Board');
    }

    // User can delete their own comment or admin/owner can delete any comment
    const role = await boardRepository.getMemberRole(column.boardId, userId);
    if (comment.userId !== userId && board.creatorId !== userId && role !== 'admin') {
      throw new ForbiddenError('You do not have permission to delete this comment');
    }

    await commentRepository.delete(commentId);
  }
}

export const commentService = new CommentService();

