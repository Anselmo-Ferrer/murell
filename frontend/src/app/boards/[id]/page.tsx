'use client'

import { BoardColumn } from '@/components/BoardColumn';
import { CreateColumnCard } from '@/components/CreateColumnCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Lock } from 'lucide-react';
import { BoardProvider, useBoardContext } from '@/contexts/BoardContext';
import { teamMembers } from '@/data/mockData';
import { useParams } from 'next/navigation';
import { Header } from '@/components/header';

const BoardDetailContent = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { boards, boardColumns } = useBoardContext();
  const board = boards.find((b) => b.id === id);
  const columns = boardColumns[id || ''] || [];

  if (!board) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <p className="text-muted-foreground">Board not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="border-b bg-card">
        <div className="container max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">{board.title}</h1>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Lock className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {teamMembers.slice(0, 4).map((member) => (
                  <Avatar key={member.id} className="h-8 w-8 border-2 border-card">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-primary text-xs font-medium text-primary-foreground">
                  +44
                </div>
              </div>
              <span className="text-sm font-medium">Menu</span>
            </div>
          </div>
        </div>
      </div>

      <main className="container max-w-full mx-auto px-6 py-6 overflow-x-auto h-[calc(100vh-10rem)]">
        <div className="flex gap-4 h-full">
          {columns.map((column) => (
            <BoardColumn key={column.id} column={column} boardId={id || ''} />
          ))}
          <CreateColumnCard boardId={id || ''} />
        </div>
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
