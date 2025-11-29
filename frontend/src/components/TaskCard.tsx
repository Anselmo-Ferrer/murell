import { MessageSquare, Heart, Paperclip, MoreHorizontal } from 'lucide-react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card as CardType } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  card: CardType;
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

export const TaskCard = ({ card }: TaskCardProps) => {
  return (
    <Card className="group bg-card border-border hover:shadow-md transition-all cursor-pointer">
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
          <div className="relative -mx-4 -mt-4 mb-3 overflow-hidden rounded-t-lg">
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-40 object-cover"
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

          <div className="flex items-center gap-3 text-muted-foreground">
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
          </div>
        </div>
      </div>
    </Card>
  );
};
