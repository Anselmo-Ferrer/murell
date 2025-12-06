'use client';

import { useState } from 'react';
import { MessageSquare, Heart, Paperclip, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { EditCardDialog } from './EditCardDialog';
import { DeleteAlert } from './DeleteAlert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Card as CardType } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBoardContext } from '@/contexts/BoardContext';
import { cardService } from '@/services/card.service';
import { useToast } from '@/hooks/use-toast';

interface TaskCardProps {
  card: CardType;
  boardId: string;
  columnId: string;
}

const labelColorMap: Record<string, string> = {
  purple: 'bg-label-purple',
  red: 'bg-label-red',
  pink: 'bg-label-pink',
  cyan: 'bg-label-cyan',
  green: 'bg-label-green',
  yellow: 'bg-label-yellow',
  blue: 'bg-label-blue',
  orange: 'bg-label-orange',
};

export const TaskCard = ({ card, boardId, columnId }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { loadBoardColumns } = useBoardContext();
  const { toast } = useToast();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true);
      await cardService.deleteCard(card.id);
      await loadBoardColumns(boardId);
      toast({
        title: 'Card apagado!',
        description: 'O card foi apagado com sucesso.',
      });
      setDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Erro ao apagar card',
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditDialogOpen(true);
  };

  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Card className="group bg-card border-border hover:shadow-md transition-all cursor-move relative">
          <div className="absolute top-2 right-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onPointerDown={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={handleEditClick}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDeleteClick} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Apagar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="p-4 space-y-3">
        {card.labels.length > 0 && (
          <div className="flex gap-1">
            {card.labels.map((label, idx) => (
              <div
                key={idx}
                className={cn(
                  'h-2 w-12 rounded-full',
                  labelColorMap[label] || 'bg-muted'
                )}
              />
            ))}
          </div>
        )}

        {card.image && (
          <div className="relative -mx-4 -mt-4 mb-3 overflow-hidden rounded-t-lg p-3">
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-40 object-cover rounded-lg"
            />
          </div>
        )}

        <h4 className="text-sm font-semibold text-foreground leading-tight">
          {card.title}
        </h4>

        {card.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {card.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex -space-x-2">
            {card.members.map((member) => (
              <Avatar key={member.id} className="h-6 w-6 border-2 border-card">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-xs">{member.name[0]}</AvatarFallback>
              </Avatar>
            ))}
          </div>

          {/* <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1 text-xs">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{card.comments}</span>
            </div>
            {card.likes > 0 && (
              <div className="flex items-center gap-1 text-xs">
                <Heart className="h-3.5 w-3.5" />
                <span>{card.likes}</span>
              </div>
            )}
            {card.attachments > 0 && (
              <div className="flex items-center gap-1 text-xs">
                <Paperclip className="h-3.5 w-3.5" />
                <span>{card.attachments}</span>
              </div>
            )}
          </div> */}
        </div>
      </div>
      </Card>
    </div>
    
    <EditCardDialog
      open={editDialogOpen}
      onOpenChange={setEditDialogOpen}
      card={card}
      boardId={boardId}
      columnId={columnId}
    />

    <DeleteAlert
      open={deleteDialogOpen}
      onOpenChange={setDeleteDialogOpen}
      title="Apagar Card"
      description="Tem certeza que deseja apagar este card? Esta ação não pode ser desfeita."
      onConfirm={handleConfirmDelete}
      isLoading={isLoading}
    />
    </>
  );
};
