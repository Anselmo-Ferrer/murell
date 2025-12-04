'use client';

import { MoreHorizontal, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { TaskCard } from './TaskCard';
import { CreateCardDialog } from './CreateCardDialog';
import { Column } from '@/data/mockData';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';

interface BoardColumnProps {
  column: Column;
  boardId: string;
}

export const BoardColumn = ({ column, boardId }: BoardColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const cardIds = column.cards.map((card) => card.id);

  return (
    <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
      <div
        ref={setNodeRef}
        className={cn(
          'flex min-w-[320px] h-full flex-col rounded-lg p-3 transition-colors',
          isOver && 'bg-muted/50 ring-2 ring-primary ring-offset-2'
        )}
      >
        <div className="flex items-center justify-between mb-3 flex-shrink-0 bg-card border border-border hover:shadow-md transition-all p-2 rounded-lg">
          <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto scrollbar-hide min-h-0">
          {column.cards.map((card) => (
            <TaskCard key={card.id} card={card} />
          ))}
        </div>

        <CreateCardDialog boardId={boardId} columnId={column.id}>
          <Button
            variant="ghost"
            className="mt-3 w-full justify-start text-sm text-muted-foreground hover:bg-muted/50 flex-shrink-0 rounded-lg border-2 border-dashed border-muted-foreground/30"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add new card
          </Button>
        </CreateCardDialog>
      </div>
    </SortableContext>
  );
};
