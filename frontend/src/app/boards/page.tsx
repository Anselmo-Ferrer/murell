'use client'

import { BoardCard } from '@/components/BoardCard';
import { CreateBoardCard } from '@/components/CreateBoardCard';
import { Header } from '@/components/header';
import { BoardProvider, useBoardContext } from '@/contexts/BoardContext';

const BoardsContent = () => {
  const { boards } = useBoardContext();
  
  const recentlyViewed = boards.filter((b) => b.category === 'recently-viewed');
  const newBoards = boards.filter((b) => b.category === 'new');
  const process = boards.filter((b) => b.category === 'process');
  const completed = boards.filter((b) => b.category === 'completed');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-10">
          {/* Recently Viewed */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Recently viewed</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {recentlyViewed.map((board) => (
                <BoardCard key={board.id} board={board} />
              ))}
            </div>
          </section>

          {/* New */}
          <section>
            <h2 className="text-2xl font-bold mb-6">New</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {newBoards.map((board) => (
                <BoardCard key={board.id} board={board} />
              ))}
              <CreateBoardCard />
            </div>
          </section>

          {/* Process */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {process.map((board) => (
                <BoardCard key={board.id} board={board} />
              ))}
              <CreateBoardCard />
            </div>
          </section>

          {/* Completed */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Completed</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {completed.map((board) => (
                <BoardCard key={board.id} board={board} />
              ))}
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
