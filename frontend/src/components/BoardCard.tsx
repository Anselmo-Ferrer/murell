'use client';

import { useState } from 'react';
import { ArrowRight, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { EditBoardDialog } from './EditBoardDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Card } from './ui/card';
import { Board } from '@/data/mockData';
import { useBoardContext } from '@/contexts/BoardContext';
import { boardService } from '@/services/board.service';
import { useToast } from '@/hooks/use-toast';

interface BoardCardProps {
  board: Board;
}

const colorMap: Record<string, string> = {
  gray: 'bg-pastel-gray',
  blue: 'bg-pastel-blue',
  pink: 'bg-pastel-pink',
  green: 'bg-pastel-green',
  peach: 'bg-pastel-peach',
  purple: 'bg-pastel-purple',
  yellow: 'bg-pastel-yellow',
  cyan: 'bg-pastel-cyan',
};

export const BoardCard = ({ board }: BoardCardProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { refreshBoards } = useBoardContext();
  const { toast } = useToast();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Tem certeza que deseja apagar este board? Todos os dados serão perdidos.')) {
      return;
    }

    try {
      await boardService.deleteBoard(board.id);
      await refreshBoards();
      toast({
        title: 'Board apagado!',
        description: 'O board foi apagado com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao apagar board',
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditDialogOpen(true);
  };

  return (
    <>
      <Card
        className={cn(
          'h-full group relative overflow-hidden border-none transition-all hover:shadow-md hover:-translate-y-0.5',
          colorMap[board.color] || 'bg-pastel-gray'
        )}
      >
        <div className="absolute top-2 right-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#fff] dark:hover:bg-[#000] text-[#000]"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onPointerDown={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={handleEditClick}>
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
        
        <Link href={`/boards/${board.id}`} className="block h-full">
          <div className="p-6 space-y-4 flex flex-col h-full justify-between">
            <h3 className="text-lg font-semibold text-[#000] leading-tight">
              {board.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {board.description}
            </p>
            <div className="flex items-center justify-between pt-2">
              <div className="flex -space-x-2">
                {board.members.slice(0, 3).map((member) => (
                  <Avatar key={member.id} className="h-8 w-8 border-2 border-card">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
                {board.members.length > 3 && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-primary text-xs font-medium text-primary-foreground">
                    +{board.members.length - 3}
                  </div>
                )}
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      </Card>
      
      <EditBoardDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        board={board}
      />
    </>
  );
};
