import { Response } from 'express';
import { commentService } from '../services/comment.service';
import { AuthRequest } from '../types';

export class CommentController {
  async getComments(req: AuthRequest, res: Response) {
    const { cardId } = req.params;
    const userId = req.user!.id;
    const comments = await commentService.getComments(cardId, userId);
    res.json({
      success: true,
      data: comments,
    });
  }

  async createComment(req: AuthRequest, res: Response) {
    const { cardId } = req.params;
    const { content } = req.body;
    const userId = req.user!.id;
    const comment = await commentService.createComment(cardId, userId, content);
    res.status(201).json({
      success: true,
      data: comment,
    });
  }

  async updateComment(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user!.id;
    const comment = await commentService.updateComment(id, userId, content);
    res.json({
      success: true,
      data: comment,
    });
  }

  async deleteComment(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;
    await commentService.deleteComment(id, userId);
    res.json({
      success: true,
      message: 'Comment deleted successfully',
    });
  }
}

export const commentController = new CommentController();

