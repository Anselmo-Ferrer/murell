import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useBoardContext } from '@/contexts/BoardContext';
import { Board } from '@/data/mockData';

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
  const [category, setCategory] = useState<Board['category']>('new');
  const { addBoard } = useBoardContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const newBoard: Board = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      members: [],
      color,
      category,
    };

    addBoard(newBoard);
    
    // Reset form
    setTitle('');
    setDescription('');
    setColor('blue');
    setCategory('new');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create new board</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter board title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter board description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColor(option.value)}
                  className={`h-12 rounded-md transition-all ${option.class} ${
                    color === option.value
                      ? 'ring-2 ring-primary ring-offset-2'
                      : 'hover:ring-2 hover:ring-muted-foreground/30'
                  }`}
                  title={option.label}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as Board['category'])}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="process">Process</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Board</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};