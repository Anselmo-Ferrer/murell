'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { useBoardContext, transformBackendColumn } from '@/contexts/BoardContext';
import { columnService } from '@/services/column.service';
import { useToast } from '@/hooks/use-toast';
import { Column } from '@/data/mockData';

interface EditColumnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  column: Column;
  boardId: string;
}

export const EditColumnDialog = ({ open, onOpenChange, column, boardId }: EditColumnDialogProps) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { updateColumn, loadBoardColumns } = useBoardContext();
  const { toast } = useToast();

  useEffect(() => {
    if (column) {
      setTitle(column.title);
    }
  }, [column]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    setIsLoading(true);

    try {
      const updatedColumn = await columnService.updateColumn(column.id, {
        title: title.trim(),
      });

      const transformedColumn = transformBackendColumn(updatedColumn);
      updateColumn(boardId, transformedColumn);
      await loadBoardColumns(boardId);
      
      toast({
        title: 'Coluna atualizada!',
        description: 'A coluna foi atualizada com sucesso.',
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Erro ao atualizar coluna',
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Editar coluna</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="column-title">Título da coluna *</Label>
            <Input
              id="column-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da coluna"
              required
              autoFocus
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

