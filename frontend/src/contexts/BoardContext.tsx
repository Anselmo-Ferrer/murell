'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Board, Column, Card, boardColumns as initialBoardColumns, TeamMember } from '@/data/mockData';
import { Board as BackendBoard, boardService } from '@/services/board.service';
import { Column as BackendColumn, Card as BackendCard, columnService } from '@/services/column.service';
import { cardService } from '@/services/card.service';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface BoardContextType {
  boards: Board[];
  boardColumns: Record<string, Column[]>;
  isLoading: boolean;
  refreshBoards: () => Promise<void>;
  loadBoardColumns: (boardId: string) => Promise<void>;
  addBoard: (board: Board) => void;
  addColumn: (boardId: string, column: Column) => void;
  addCard: (boardId: string, columnId: string, card: Card) => void;
  updateColumn: (boardId: string, column: Column) => void;
  updateCard: (boardId: string, columnId: string, card: Card) => void;
  moveCard: (boardId: string, cardId: string, sourceColumnId: string, targetColumnId: string, newPosition: number) => Promise<void>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

// Transform backend board to frontend format
export const transformBackendBoard = (backendBoard: BackendBoard): Board => {
  const members = backendBoard.members?.map((member) => ({
    id: member.user.id,
    name: member.user.name,
    avatar: member.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(member.user.name)}`,
  })) || [];

  // Add creator as member if not already in members
  if (backendBoard.creator && !members.find(m => m.id === backendBoard.creatorId)) {
    members.unshift({
      id: backendBoard.creator.id,
      name: backendBoard.creator.name,
      avatar: backendBoard.creator.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(backendBoard.creator.name)}`,
    });
  }

  return {
    id: backendBoard.id,
    title: backendBoard.title,
    description: backendBoard.description || '',
    members,
    color: (backendBoard.color || 'gray') as Board['color'],
    createdAt: backendBoard.createdAt,
    updatedAt: backendBoard.updatedAt,
  };
};

// Transform backend column to frontend format
export const transformBackendColumn = (backendColumn: BackendColumn): Column => {
  return {
    id: backendColumn.id,
    title: backendColumn.title,
    cards: (backendColumn.cards || []).map(transformBackendCard),
  };
};

// Transform backend card to frontend format
export const transformBackendCard = (backendCard: BackendCard): Card => {
  const members: TeamMember[] = (backendCard.members || []).map((member) => ({
    id: member.id,
    name: member.name,
    avatar: member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(member.name)}`,
  }));

  // Transform labels - backend returns labels as Array<{ id, name, color }>
  // or nested as Array<{ label: { id, name, color } }>
  const labels = (backendCard.labels || []).map((label: any) => {
    // Handle nested format from Prisma: { label: { color, name } }
    if (label && typeof label === 'object') {
      if (label.label && typeof label.label === 'object' && 'color' in label.label) {
        return label.label.color;
      }
      // Handle direct format: { color, name }
      if ('color' in label) {
        return label.color;
      }
    }
    return '';
  }).filter((color: string) => color && color.trim() !== '');

  return {
    id: backendCard.id,
    title: backendCard.title,
    description: backendCard.description || '',
    labels,
    members,
    comments: backendCard._count?.comments || 0,
    likes: backendCard._count?.likes || 0,
    attachments: backendCard._count?.attachments || 0,
    image: backendCard.image || undefined,
  };
};

export const BoardProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [boards, setBoards] = useState<Board[]>([]);
  const [boardColumns, setBoardColumns] = useState<Record<string, Column[]>>(initialBoardColumns);
  const [isLoading, setIsLoading] = useState(true);

  const refreshBoards = async () => {
    if (!authService.isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    try {
      setIsLoading(true);
      const backendBoards = await boardService.getBoards();
      const transformedBoards = backendBoards.map(transformBackendBoard);
      setBoards(transformedBoards);
    } catch (error) {
      console.error('Failed to load boards:', error);
      toast({
        title: 'Erro ao carregar boards',
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshBoards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addBoard = (board: Board) => {
    setBoards((prev) => [...prev, board]);
    setBoardColumns((prev) => ({ ...prev, [board.id]: [] }));
  };

  const addColumn = (boardId: string, column: Column) => {
    setBoardColumns((prev) => ({
      ...prev,
      [boardId]: [...(prev[boardId] || []), column],
    }));
  };

  const loadBoardColumns = async (boardId: string) => {
    if (!authService.isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    try {
      const backendColumns = await columnService.getColumns(boardId);
      const transformedColumns = backendColumns.map(transformBackendColumn);
      setBoardColumns((prev) => ({
        ...prev,
        [boardId]: transformedColumns,
      }));
    } catch (error) {
      console.error('Failed to load columns:', error);
      toast({
        title: 'Erro ao carregar colunas',
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    }
  };

  const addCard = (boardId: string, columnId: string, card: Card) => {
    setBoardColumns((prev) => ({
      ...prev,
      [boardId]: prev[boardId].map((col) =>
        col.id === columnId
          ? { ...col, cards: [...col.cards, card] }
          : col
      ),
    }));
  };

  const updateColumn = (boardId: string, column: Column) => {
    setBoardColumns((prev) => ({
      ...prev,
      [boardId]: prev[boardId].map((col) =>
        col.id === column.id ? column : col
      ),
    }));
  };

  const updateCard = (boardId: string, columnId: string, card: Card) => {
    setBoardColumns((prev) => ({
      ...prev,
      [boardId]: prev[boardId].map((col) =>
        col.id === columnId
          ? { ...col, cards: col.cards.map((c) => (c.id === card.id ? card : c)) }
          : col
      ),
    }));
  };

  const moveCard = async (
    boardId: string,
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string,
    newPosition: number
  ) => {
    try {
      // Update UI optimistically
      setBoardColumns((prev) => {
        const columns = prev[boardId] || [];
        const sourceColumn = columns.find((col) => col.id === sourceColumnId);
        const targetColumn = columns.find((col) => col.id === targetColumnId);
        
        if (!sourceColumn || !targetColumn) return prev;

        const card = sourceColumn.cards.find((c) => c.id === cardId);
        if (!card) return prev;

        // Remove card from source column
        const updatedSourceColumn = {
          ...sourceColumn,
          cards: sourceColumn.cards.filter((c) => c.id !== cardId),
        };

        // Add card to target column at new position
        const updatedTargetCards = [...targetColumn.cards];
        updatedTargetCards.splice(newPosition, 0, card);
        const updatedTargetColumn = {
          ...targetColumn,
          cards: updatedTargetCards,
        };

        return {
          ...prev,
          [boardId]: columns.map((col) => {
            if (col.id === sourceColumnId) return updatedSourceColumn;
            if (col.id === targetColumnId) return updatedTargetColumn;
            return col;
          }),
        };
      });

      // Call backend to save the move
      await cardService.moveCard(cardId, {
        columnId: targetColumnId,
        position: newPosition,
      });

      // Reload columns to get fresh data
      await loadBoardColumns(boardId);
    } catch (error) {
      console.error('Failed to move card:', error);
      toast({
        title: 'Erro ao mover card',
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
      // Reload to revert UI changes
      await loadBoardColumns(boardId);
    }
  };

  return (
    <BoardContext.Provider value={{ 
      boards, 
      boardColumns, 
      isLoading, 
      refreshBoards, 
      loadBoardColumns,
      addBoard, 
      addColumn, 
      addCard,
      updateColumn,
      updateCard,
      moveCard,
    }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoardContext = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoardContext must be used within BoardProvider');
  }
  return context;
};