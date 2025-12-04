'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { useBoardContext, transformBackendCard } from '@/contexts/BoardContext';
import { cardService } from '@/services/card.service';
import { useToast } from '@/hooks/use-toast';

interface CreateCardDialogProps {
  children: React.ReactNode;
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

export const CreateCardDialog = ({ children, boardId, columnId }: CreateCardDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addCard, loadBoardColumns } = useBoardContext();
  const { toast } = useToast();

  const toggleLabel = (label: string) => {
    setSelectedLabels((prev) =>
      prev.includes(label)
        ? prev.filter((l) => l !== label)
        : [...prev, label]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    setIsLoading(true);

    try {
      const newCard = await cardService.createCard(columnId, {
        title: title.trim(),
        description: description.trim() || undefined,
        image: imageUrl.trim() || undefined,
      });

      // Add labels if any selected
      for (const labelColor of selectedLabels) {
        try {
          await cardService.addLabel(newCard.id, {
            name: labelColor,
            color: labelColor,
          });
        } catch (error) {
          console.error('Failed to add label:', error);
        }
      }

      // Reload the card with all data including labels
      const fullCard = await cardService.getCardById(newCard.id);
      const transformedCard = transformBackendCard(fullCard);
      
      addCard(boardId, columnId, transformedCard);
      await loadBoardColumns(boardId);
      
      toast({
        title: 'Card criado!',
        description: 'O card foi criado com sucesso.',
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setSelectedLabels([]);
      setImageUrl('');
      setOpen(false);
    } catch (error) {
      toast({
        title: 'Erro ao criar card',
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar novo card</DialogTitle>
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
            <Label>Labels</Label>
            <div className="flex flex-wrap gap-2">
              {labelOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleLabel(option.value)}
                  disabled={isLoading}
                  className={`h-8 px-4 rounded-full text-xs font-medium text-white transition-all ${
                    option.class
                  } ${
                    selectedLabels.includes(option.value)
                      ? 'ring-2 ring-offset-2 ring-primary'
                      : 'opacity-60 hover:opacity-100'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
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
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Criar Card'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};