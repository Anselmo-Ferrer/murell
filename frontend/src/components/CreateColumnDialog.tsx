import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { useBoardContext } from '@/contexts/BoardContext';
import { Column } from '@/data/mockData';

interface CreateColumnDialogProps {
  children: React.ReactNode;
  boardId: string;
}

export const CreateColumnDialog = ({ children, boardId }: CreateColumnDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const { addColumn } = useBoardContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const newColumn: Column = {
      id: crypto.randomUUID(),
      title: title.trim(),
      cards: [],
    };

    addColumn(boardId, newColumn);
    
    // Reset form
    setTitle('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Create new column</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="column-title">Column title *</Label>
            <Input
              id="column-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter column title"
              required
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Column</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};