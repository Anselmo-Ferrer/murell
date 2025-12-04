'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Board, Column, Card, boardColumns as initialBoardColumns } from '@/data/mockData';
import { Board as BackendBoard, boardService } from '@/services/board.service';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface BoardContextType {
  boards: Board[];
  boardColumns: Record<string, Column[]>;
  isLoading: boolean;
  refreshBoards: () => Promise<void>;
  addBoard: (board: Board) => void;
  addColumn: (boardId: string, column: Column) => void;
  addCard: (boardId: string, columnId: string, card: Card) => void;
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
    category: (backendBoard.category || 'new') as Board['category'],
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

  return (
    <BoardContext.Provider value={{ boards, boardColumns, isLoading, refreshBoards, addBoard, addColumn, addCard }}>
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