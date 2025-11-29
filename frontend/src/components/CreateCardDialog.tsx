import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { useBoardContext } from '@/contexts/BoardContext';
import { Card } from '@/data/mockData';

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
  const { addCard } = useBoardContext();

  const toggleLabel = (label: string) => {
    setSelectedLabels((prev) =>
      prev.includes(label)
        ? prev.filter((l) => l !== label)
        : [...prev, label]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const newCard: Card = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      labels: selectedLabels,
      members: [],
      comments: 0,
      likes: 0,
      attachments: 0,
      ...(imageUrl.trim() && { image: imageUrl.trim() }),
    };

    addCard(boardId, columnId, newCard);
    
    // Reset form
    setTitle('');
    setDescription('');
    setSelectedLabels([]);
    setImageUrl('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create new card</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-title">Title *</Label>
            <Input
              id="card-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter card title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-description">Description</Label>
            <Textarea
              id="card-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter card description"
              rows={3}
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
                  className={`h-8 px-4 rounded-full text-xs font-medium text-white transition-all ${
                    option.class
                  } ${
                    selectedLabels.includes(option.value)
                      ? 'ring-2 ring-offset-2 ring-primary'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Card</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};