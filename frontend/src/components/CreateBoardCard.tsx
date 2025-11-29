import { Plus } from 'lucide-react';
import { Card } from './ui/card';
import { CreateBoardDialog } from './CreateBoardDialog';

export const CreateBoardCard = () => {
  return (
    <CreateBoardDialog>
      <Card className="group relative overflow-hidden border-2 border-dashed border-muted-foreground/30 bg-transparent transition-all hover:border-muted-foreground/50 hover:shadow-md cursor-pointer">
        <div className="flex h-full min-h-[180px] items-center justify-center p-6">
          <div className="text-center space-y-2">
            <Plus className="h-8 w-8 mx-auto text-muted-foreground transition-transform group-hover:scale-110" />
            <p className="text-sm font-medium text-muted-foreground">
              Create new board
            </p>
          </div>
        </div>
      </Card>
    </CreateBoardDialog>
  );
};
