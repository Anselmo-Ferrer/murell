'use client'

import { useState } from 'react';
import { BoardCard } from '@/components/BoardCard';
import { CreateBoardCard } from '@/components/CreateBoardCard';
import { Header } from '@/components/header';
import { BoardProvider, useBoardContext } from '@/contexts/BoardContext';

type FilterType = 'all' | 'new' | 'recently-updated';

const BoardsContent = () => {
  const { boards, isLoading, searchQuery } = useBoardContext();
  const [filter, setFilter] = useState<FilterType>('all');
  
  // Calcula a data de 3 dias atrás
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
  // Boards atualizados nos últimos 3 dias
  const recentlyUpdated = boards.filter((b) => {
    const updatedAt = new Date(b.updatedAt);
    return updatedAt >= threeDaysAgo;
  });
  
  // Boards criados nos últimos 3 dias
  const newBoards = boards.filter((b) => {
    const createdAt = new Date(b.createdAt);
    return createdAt >= threeDaysAgo;
  });
  
  // Seleciona os boards baseado no filtro
  let displayBoards = filter === 'all' 
    ? boards 
    : filter === 'new' 
    ? newBoards 
    : recentlyUpdated;

  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    displayBoards = displayBoards.filter(board => 
      board.title.toLowerCase().includes(query) || 
      (board.description && board.description.toLowerCase().includes(query))
    );
  }

  const getFilterLabel = () => {
    switch(filter) {
      case 'all': return 'All boards';
      case 'new': return 'New';
      case 'recently-updated': return 'Recently updated';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-muted-foreground">Carregando boards...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Header com filtros */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Boards</h1>
            
            {/* Botões de filtro */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('new')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'new'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                New
              </button>
              <button
                onClick={() => setFilter('recently-updated')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'recently-updated'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                Recently Updated
              </button>
            </div>
          </div>

          {/* Grid de boards */}
          <section>
            <h2 className="text-2xl font-bold mb-6">{getFilterLabel()}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {displayBoards.map((board) => (
                <BoardCard key={board.id} board={board} />
              ))}
              <CreateBoardCard />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

const Boards = () => {
  return (
    <BoardProvider>
      <BoardsContent />
    </BoardProvider>
  );
};

export default Boards;