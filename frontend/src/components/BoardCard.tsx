
import { ArrowRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Card } from './ui/card';
import { Board } from '@/data/mockData';


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
  return (
    <Link href={`/boards/${board.id}`}>
      <Card
        className={cn(
          'h-full group relative overflow-hidden border-none transition-all hover:shadow-md hover:-translate-y-0.5',
          colorMap[board.color] || 'bg-pastel-gray'
        )}
      >
        <div className="p-6 space-y-4 flex flex-col h-full justify-between">
          <h3 className="text-lg font-semibold text-foreground leading-tight">
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
      </Card>
    </Link>
  );
};
