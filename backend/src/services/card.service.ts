import { cardRepository } from '../repositories/card.repository';
import { columnRepository } from '../repositories/column.repository';
import { boardRepository } from '../repositories/board.repository';
import { labelRepository } from '../repositories/label.repository';
import { NotFoundError, ForbiddenError } from '../utils/errors';

export class CardService {
  async getCards(columnId: string, userId: string) {
    const column = await columnRepository.findById(columnId);
    if (!column) {
      throw new NotFoundError('Column');
    }

    const board = await boardRepository.findById(column.boardId);
    if (!board) {
      throw new NotFoundError('Board');
    }

    const isMember = await boardRepository.isMember(column.boardId, userId);
    if (!isMember && board.creatorId !== userId && !board.isPublic) {
      throw new ForbiddenError('You do not have access to this board');
    }

    return cardRepository.findByColumnId(columnId);
  }

  async getCardById(cardId: string, userId: string) {
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

    return card;
  }

  async createCard(columnId: string, userId: string, data: { title: string; description?: string; image?: string; position?: number }) {
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
      throw new ForbiddenError('You do not have permission to create cards');
    }

    return cardRepository.create({
      ...data,
      columnId,
    });
  }

  async updateCard(cardId: string, userId: string, data: Partial<{ title: string; description: string; image: string }>) {
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

    const role = await boardRepository.getMemberRole(column.boardId, userId);
    if (board.creatorId !== userId && role !== 'admin' && role !== 'member') {
      throw new ForbiddenError('You do not have permission to update this card');
    }

    return cardRepository.update(cardId, data);
  }

  async deleteCard(cardId: string, userId: string) {
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

    const role = await boardRepository.getMemberRole(column.boardId, userId);
    if (board.creatorId !== userId && role !== 'admin') {
      throw new ForbiddenError('You do not have permission to delete this card');
    }

    await cardRepository.delete(cardId);
  }

  async moveCard(cardId: string, columnId: string, position: number, userId: string) {
    const card = await cardRepository.findById(cardId);
    if (!card) {
      throw new NotFoundError('Card');
    }

    const targetColumn = await columnRepository.findById(columnId);
    if (!targetColumn) {
      throw new NotFoundError('Column');
    }

    const board = await boardRepository.findById(targetColumn.boardId);
    if (!board) {
      throw new NotFoundError('Board');
    }

    const role = await boardRepository.getMemberRole(targetColumn.boardId, userId);
    if (board.creatorId !== userId && role !== 'admin' && role !== 'member') {
      throw new ForbiddenError('You do not have permission to move cards');
    }

    return cardRepository.move(cardId, columnId, position);
  }

  async addLabel(cardId: string, labelName: string, labelColor: string, userId: string) {
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

    const role = await boardRepository.getMemberRole(column.boardId, userId);
    if (board.creatorId !== userId && role !== 'admin' && role !== 'member') {
      throw new ForbiddenError('You do not have permission to modify this card');
    }

    const label = await labelRepository.findOrCreate(labelName, labelColor);
    await cardRepository.addLabel(cardId, label.id);
    return cardRepository.findById(cardId);
  }

  async removeLabel(cardId: string, labelId: string, userId: string) {
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

    const role = await boardRepository.getMemberRole(column.boardId, userId);
    if (board.creatorId !== userId && role !== 'admin' && role !== 'member') {
      throw new ForbiddenError('You do not have permission to modify this card');
    }

    await cardRepository.removeLabel(cardId, labelId);
    return cardRepository.findById(cardId);
  }

  async toggleLike(cardId: string, userId: string) {
    const card = await cardRepository.findById(cardId);
    if (!card) {
      throw new NotFoundError('Card');
    }

    return cardRepository.toggleLike(cardId, userId);
  }
}

export const cardService = new CardService();

