'use client';

import { useState } from 'react';
import { MoreHorizontal, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { TaskCard } from './TaskCard';
import { CreateCardDialog } from './CreateCardDialog';
import { EditColumnDialog } from './EditColumnDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Column } from '@/data/mockData';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import { useBoardContext } from '@/contexts/BoardContext';
import { columnService } from '@/services/column.service';
import { useToast } from '@/hooks/use-toast';

interface BoardColumnProps {
  column: Column;
  boardId: string;
}

export const BoardColumn = ({ column, boardId }: BoardColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { loadBoardColumns, updateColumn } = useBoardContext();
  const { toast } = useToast();

  const cardIds = column.cards.map((card) => card.id);

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja apagar esta coluna? Todos os cards serão removidos.')) {
      return;
    }

    try {
      await columnService.deleteColumn(column.id);
      await loadBoardColumns(boardId);
      toast({
        title: 'Coluna apagada!',
        description: 'A coluna foi apagada com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao apagar coluna',
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={cn(
            'flex min-w-[320px] h-full flex-col rounded-lg p-1 transition-colors',
            isOver && 'bg-muted/50 ring-2 ring-primary ring-offset-2'
          )}
        >
          <div className="flex items-center justify-between mb-3 shrink-0 bg-card border border-border hover:shadow-md transition-all p-2 rounded-lg">
            <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Apagar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0">
          <div className="space-y-3">
            {column.cards.map((card) => (
              <TaskCard key={card.id} card={card} boardId={boardId} columnId={column.id} />
            ))}
          </div>

          <CreateCardDialog boardId={boardId} columnId={column.id}>
            <Button
              variant="ghost"
              className="mt-3 w-full justify-start text-sm text-muted-foreground hover:bg-muted/50 shrink-0 rounded-lg border-2 border-dashed border-muted-foreground/30"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add new card
            </Button>
          </CreateCardDialog>
        </div>
      </div>
    </SortableContext>
    
    <EditColumnDialog
      open={editDialogOpen}
      onOpenChange={setEditDialogOpen}
      column={column}
      boardId={boardId}
    />
    </>
  );
};