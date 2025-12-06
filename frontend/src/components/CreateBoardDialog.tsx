'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useBoardContext, transformBackendBoard } from '@/contexts/BoardContext';
import { Board } from '@/data/mockData';
import { boardService } from '@/services/board.service';
import { useToast } from '@/hooks/use-toast';

interface CreateBoardDialogProps {
  children: React.ReactNode;
}

const colorOptions = [
  { value: 'gray', label: 'Gray', class: 'bg-[hsl(var(--pastel-gray))]' },
  { value: 'blue', label: 'Blue', class: 'bg-[hsl(var(--pastel-blue))]' },
  { value: 'pink', label: 'Pink', class: 'bg-[hsl(var(--pastel-pink))]' },
  { value: 'green', label: 'Green', class: 'bg-[hsl(var(--pastel-green))]' },
  { value: 'peach', label: 'Peach', class: 'bg-[hsl(var(--pastel-peach))]' },
  { value: 'purple', label: 'Purple', class: 'bg-[hsl(var(--pastel-purple))]' },
  { value: 'yellow', label: 'Yellow', class: 'bg-[hsl(var(--pastel-yellow))]' },
  { value: 'cyan', label: 'Cyan', class: 'bg-[hsl(var(--pastel-cyan))]' },
];

export const CreateBoardDialog = ({ children }: CreateBoardDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('blue');
  const [isLoading, setIsLoading] = useState(false);
  const { addBoard, refreshBoards } = useBoardContext();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    setIsLoading(true);

    try {
      const newBoard = await boardService.createBoard({
        title: title.trim(),
        description: description.trim() || undefined,
        color: color || undefined,
      });

      // Transform backend board to frontend format
      const transformedBoard = transformBackendBoard(newBoard);

      addBoard(transformedBoard);
      await refreshBoards();
      
      toast({
        title: 'Board criado!',
        description: 'O board foi criado com sucesso.',
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setColor('blue');
      setOpen(false);
    } catch (error) {
      toast({
        title: 'Erro ao criar board',
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar novo board</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do board"
              required
              disabled={isLoading}
              className='mt-3'
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite a descrição do board"
              rows={3}
              disabled={isLoading}
              className='mt-3'
            />
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="grid grid-cols-4 gap-2 mt-3">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColor(option.value)}
                  disabled={isLoading}
                  className={`h-12 rounded-md transition-all ${option.class} ${
                    color === option.value
                      ? 'ring-2 ring-primary ring-offset-2'
                      : 'hover:ring-2 hover:ring-muted-foreground/30'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={option.label}
                />
              ))}
            </div>
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
              {isLoading ? 'Criando...' : 'Criar Board'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};