'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { useBoardContext, transformBackendCard } from '@/contexts/BoardContext';
import { cardService } from '@/services/card.service';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/data/mockData';

interface EditCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: Card;
  boardId: string;
  columnId: string;
}

const labelOptions = [
  { value: 'purple', label: 'Purple', class: 'bg-[hsl(var(--label-purple))]' },
  { value: 'red', label: 'Red', class: 'bg-[hsl(var(--label-red))]' },
  { value: 'pink', label: 'Pink', class: 'bg-[hsl(var(--label-pink))]' },
  { value: 'cyan', label: 'Cyan', class: 'bg-[hsl(var(--label-cyan))]' },
  { value: 'green', label: 'Green', class: 'bg-[hsl(var(--label-green))]' },
  { value: 'yellow', label: 'Yellow', class: 'bg-[hsl(var(--label-yellow))]' },
  { value: 'blue', label: 'Blue', class: 'bg-[hsl(var(--label-blue))]' },
];

export const EditCardDialog = ({ open, onOpenChange, card, boardId, columnId }: EditCardDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { updateCard, loadBoardColumns } = useBoardContext();
  const { toast } = useToast();

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || '');
      setImageUrl(card.image || '');
    }
  }, [card]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    setIsLoading(true);

    try {
      const updatedCard = await cardService.updateCard(card.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        image: imageUrl.trim() || undefined,
      });

      // Reload the card with all data
      const fullCard = await cardService.getCardById(card.id);
      const transformedCard = transformBackendCard(fullCard);
      
      updateCard(boardId, columnId, transformedCard);
      await loadBoardColumns(boardId);
      
      toast({
        title: 'Card atualizado!',
        description: 'O card foi atualizado com sucesso.',
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Erro ao atualizar card',
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar card</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-title">Título *</Label>
            <Input
              id="card-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do card"
              required
              autoFocus
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-description">Descrição</Label>
            <Textarea
              id="card-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite a descrição do card"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image-url">URL da Imagem</Label>
            <Input
              id="image-url"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={isLoading}
            />
            {imageUrl && (
              <div className="mt-2 rounded-md overflow-hidden border">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
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

