import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Board, Column, Card, boards as initialBoards, boardColumns as initialBoardColumns } from '@/data/mockData';

interface BoardContextType {
  boards: Board[];
  boardColumns: Record<string, Column[]>;
  addBoard: (board: Board) => void;
  addColumn: (boardId: string, column: Column) => void;
  addCard: (boardId: string, columnId: string, card: Card) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider = ({ children }: { children: ReactNode }) => {
  const [boards, setBoards] = useState<Board[]>(initialBoards);
  const [boardColumns, setBoardColumns] = useState<Record<string, Column[]>>(initialBoardColumns);

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
    <BoardContext.Provider value={{ boards, boardColumns, addBoard, addColumn, addCard }}>
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