import { Response } from 'express';
import { boardService } from '../services/board.service';
import { AuthRequest } from '../types';

export class BoardController {
  async getBoards(req: AuthRequest, res: Response) {
    const userId = req.user!.id;
    const boards = await boardService.getBoards(userId);
    res.json({
      success: true,
      data: boards,
    });
  }

  async getBoardById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;
    const board = await boardService.getBoardById(id, userId);
    res.json({
      success: true,
      data: board,
    });
  }

  async createBoard(req: AuthRequest, res: Response) {
    const userId = req.user!.id;
    const board = await boardService.createBoard(userId, req.body);
    res.status(201).json({
      success: true,
      data: board,
    });
  }

  async updateBoard(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;
    const board = await boardService.updateBoard(id, userId, req.body);
    res.json({
      success: true,
      data: board,
    });
  }

  async deleteBoard(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;
    await boardService.deleteBoard(id, userId);
    res.json({
      success: true,
      message: 'Board deleted successfully',
    });
  }

  async addMember(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { userId: memberUserId, role } = req.body;
    const userId = req.user!.id;
    const member = await boardService.addMember(id, userId, memberUserId, role);
    res.status(201).json({
      success: true,
      data: member,
    });
  }

  async removeMember(req: AuthRequest, res: Response) {
    const { id, userId: memberUserId } = req.params;
    const userId = req.user!.id;
    await boardService.removeMember(id, userId, memberUserId);
    res.json({
      success: true,
      message: 'Member removed successfully',
    });
  }
}

export const boardController = new BoardController();

