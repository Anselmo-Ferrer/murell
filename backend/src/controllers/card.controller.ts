import { Response } from 'express';
import { cardService } from '../services/card.service';
import { AuthRequest } from '../types';

export class CardController {
  async getCards(req: AuthRequest, res: Response) {
    const { columnId } = req.params;
    const userId = req.user!.id;
    const cards = await cardService.getCards(columnId, userId);
    res.json({
      success: true,
      data: cards,
    });
  }

  async getCardById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;
    const card = await cardService.getCardById(id, userId);
    res.json({
      success: true,
      data: card,
    });
  }

  async createCard(req: AuthRequest, res: Response) {
    const { columnId } = req.params;
    const userId = req.user!.id;
    const card = await cardService.createCard(columnId, userId, req.body);
    res.status(201).json({
      success: true,
      data: card,
    });
  }

  async updateCard(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;
    const card = await cardService.updateCard(id, userId, req.body);
    res.json({
      success: true,
      data: card,
    });
  }

  async deleteCard(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;
    await cardService.deleteCard(id, userId);
    res.json({
      success: true,
      message: 'Card deleted successfully',
    });
  }

  async moveCard(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { columnId, position } = req.body;
    const userId = req.user!.id;
    const card = await cardService.moveCard(id, columnId, position, userId);
    res.json({
      success: true,
      data: card,
    });
  }

  async addLabel(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { name, color } = req.body;
    const userId = req.user!.id;
    const card = await cardService.addLabel(id, name, color, userId);
    res.json({
      success: true,
      data: card,
    });
  }

  async removeLabel(req: AuthRequest, res: Response) {
    const { id, labelId } = req.params;
    const userId = req.user!.id;
    const card = await cardService.removeLabel(id, labelId, userId);
    res.json({
      success: true,
      data: card,
    });
  }

  async toggleLike(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;
    const result = await cardService.toggleLike(id, userId);
    res.json({
      success: true,
      data: result,
    });
  }
}

export const cardController = new CardController();

