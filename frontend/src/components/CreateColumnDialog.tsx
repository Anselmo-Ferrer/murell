'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { useBoardContext, transformBackendColumn } from '@/contexts/BoardContext';
import { columnService } from '@/services/column.service';
import { useToast } from '@/hooks/use-toast';

interface CreateColumnDialogProps {
  children: React.ReactNode;
  boardId: string;
}

export const CreateColumnDialog = ({ children, boardId }: CreateColumnDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addColumn, loadBoardColumns } = useBoardContext();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    setIsLoading(true);

    try {
      const newColumn = await columnService.createColumn(boardId, {
        title: title.trim(),
      });

      const transformedColumn = transformBackendColumn(newColumn);
      addColumn(boardId, transformedColumn);
      await loadBoardColumns(boardId);
      
      toast({
        title: 'Coluna criada!',
        description: 'A coluna foi criada com sucesso.',
      });
      
      // Reset form
      setTitle('');
      setOpen(false);
    } catch (error) {
      toast({
        title: 'Erro ao criar coluna',
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Criar nova coluna</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="column-title">Título da coluna</Label>
            <Input
              id="column-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da coluna"
              required
              autoFocus
              disabled={isLoading}
              className='mt-3'
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Criar Coluna'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};