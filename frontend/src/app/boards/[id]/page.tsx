'use client'

import { useEffect, useState } from 'react';
import { BoardColumn } from '@/components/BoardColumn';
import { CreateColumnCard } from '@/components/CreateColumnCard';
import { TaskCard } from '@/components/TaskCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Lock } from 'lucide-react';
import { BoardProvider, useBoardContext } from '@/contexts/BoardContext';
import { useParams } from 'next/navigation';
import { Header } from '@/components/header';
import { boardService } from '@/services/board.service';
import { transformBackendBoard } from '@/contexts/BoardContext';
import { Board } from '@/data/mockData';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

const BoardDetailContent = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [board, setBoard] = useState<Board | null>(null);
  const [isLoadingBoard, setIsLoadingBoard] = useState(true);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const { boards, boardColumns, loadBoardColumns, isLoading, moveCard } = useBoardContext();
  const columns = boardColumns[id || ''] || [];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveCardId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find source and target columns
    const sourceColumn = columns.find((col) =>
      col.cards.some((card) => card.id === activeId)
    );

    if (!sourceColumn) return;

    // Check if over is a column
    const targetColumn = columns.find((col) => col.id === overId);
    if (targetColumn && targetColumn.id !== sourceColumn.id) {
      // Visual feedback can be added here
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCardId(null);

    if (!over || !id) return;

    const cardId = active.id as string;
    const overId = over.id as string;

    // Find source column
    const sourceColumn = columns.find((col) =>
      col.cards.some((card) => card.id === cardId)
    );

    if (!sourceColumn) return;

    // Check if dropped on a column or another card
    let targetColumnId: string;
    let newPosition: number;

    // Check if overId is a column ID
    const targetColumn = columns.find((col) => col.id === overId);
    
    if (targetColumn) {
      // Dropped directly on a column - append to end
      targetColumnId = targetColumn.id;
      newPosition = targetColumn.cards.length;
    } else {
      // Dropped on another card - find which column it belongs to
      const targetCardColumn = columns.find((col) =>
        col.cards.some((card) => card.id === overId)
      );
      
      if (!targetCardColumn) return;

      targetColumnId = targetCardColumn.id;
      const targetCardIndex = targetCardColumn.cards.findIndex((card) => card.id === overId);
      
      if (sourceColumn.id === targetColumnId) {
        // Moving within same column
        const currentIndex = sourceColumn.cards.findIndex((card) => card.id === cardId);
        newPosition = targetCardIndex;
        
        // Skip if no change
        if (currentIndex === targetCardIndex) return;
      } else {
        // Moving to different column - insert before target card
        newPosition = targetCardIndex >= 0 ? targetCardIndex : targetCardColumn.cards.length;
      }
    }

    await moveCard(id, cardId, sourceColumn.id, targetColumnId, newPosition);
  };

  useEffect(() => {
    const fetchBoard = async () => {
      if (!id) return;

      try {
        setIsLoadingBoard(true);
        // Try to find board in context first
        const contextBoard = boards.find((b) => b.id === id);
        if (contextBoard) {
          setBoard(contextBoard);
        } else {
          // If not found, fetch from backend
          const backendBoard = await boardService.getBoardById(id);
          const transformedBoard = transformBackendBoard(backendBoard);
          setBoard(transformedBoard);
        }
        
        // Load columns for this board
        await loadBoardColumns(id);
      } catch (error) {
        console.error('Failed to load board:', error);
      } finally {
        setIsLoadingBoard(false);
      }
    };

    fetchBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoadingBoard || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <p className="text-muted-foreground">Carregando board...</p>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <p className="text-muted-foreground">Board não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="border-b bg-background">
        <div className="container max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">{board.title}</h1>
              {/* <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Lock className="h-4 w-4" />
                </Button>
              </div> */}
            </div>

            {/* <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {board.members.slice(0, 4).map((member) => (
                  <Avatar key={member.id} className="h-8 w-8 border-2 border-card">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
                {board.members.length > 4 && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-primary text-xs font-medium text-primary-foreground">
                    +{board.members.length - 4}
                  </div>
                )}
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <main className="container max-w-full mx-auto px-6 py-6 overflow-x-auto h-[calc(100vh-10rem)]">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-3 h-full">
            {columns.map((column) => (
              <BoardColumn key={column.id} column={column} boardId={id || ''} />
            ))}
            <CreateColumnCard boardId={id || ''} />
          </div>
          <DragOverlay>
            {activeCardId && (() => {
              const activeColumn = columns.find((col) =>
                col.cards.some((c) => c.id === activeCardId)
              );
              const card = activeColumn?.cards.find((c) => c.id === activeCardId);
              
              if (!card || !activeColumn) return null;

              return (
                <div className="w-[304px] rotate-3 opacity-90">
                  <TaskCard 
                    card={card} 
                    boardId={id || ''} 
                    columnId={activeColumn.id} 
                  />
                </div>
              );
            })()}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
};

const BoardDetail = () => {
  return (
    <BoardProvider>
      <BoardDetailContent />
    </BoardProvider>
  );
};

export default BoardDetail;
