import { Plus } from 'lucide-react';
import { CreateColumnDialog } from './CreateColumnDialog';

interface CreateColumnCardProps {
  boardId: string;
}

export const CreateColumnCard = ({ boardId }: CreateColumnCardProps) => {
  return (
    <CreateColumnDialog boardId={boardId}>
      <div className="flex min-w-[320px] h-full cursor-pointer">
        <div className="w-full flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-transparent p-6 transition-all hover:border-muted-foreground/50 hover:bg-muted/10">
          <div className="text-center space-y-2">
            <Plus className="h-6 w-6 mx-auto text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">
              Add new column
            </p>
          </div>
        </div>
      </div>
    </CreateColumnDialog>
  );
};