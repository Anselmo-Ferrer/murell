import { Response } from 'express';
import { columnService } from '../services/column.service';
import { AuthRequest } from '../types';

export class ColumnController {
  async getColumns(req: AuthRequest, res: Response) {
    const { boardId } = req.params;
    const userId = req.user!.id;
    const columns = await columnService.getColumns(boardId, userId);
    res.json({
      success: true,
      data: columns,
    });
  }

  async createColumn(req: AuthRequest, res: Response) {
    const { boardId } = req.params;
    const userId = req.user!.id;
    const column = await columnService.createColumn(boardId, userId, req.body);
    res.status(201).json({
      success: true,
      data: column,
    });
  }

  async updateColumn(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;
    const column = await columnService.updateColumn(id, userId, req.body);
    res.json({
      success: true,
      data: column,
    });
  }

  async deleteColumn(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;
    await columnService.deleteColumn(id, userId);
    res.json({
      success: true,
      message: 'Column deleted successfully',
    });
  }

  async reorderColumns(req: AuthRequest, res: Response) {
    const { boardId } = req.params;
    const { columnIds } = req.body;
    const userId = req.user!.id;
    await columnService.reorderColumns(boardId, userId, columnIds);
    res.json({
      success: true,
      message: 'Columns reordered successfully',
    });
  }
}

export const columnController = new ColumnController();

