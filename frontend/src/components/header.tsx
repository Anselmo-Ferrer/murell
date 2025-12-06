'use client';

import { Search, Bell, Plus, Heart, CornerUpLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Link from 'next/link';
import ThemeToggle from './theme-toggle';
import { authService } from '@/services/auth.service';
import { usePathname, useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { BoardContext } from '@/contexts/BoardContext';

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname()
  const [user, setUser] = useState(authService.getCurrentUser());
  const [userInitials, setUserInitials] = useState('U');
  const [inBoard, setInBoard] = useState(false)
  const [showSearch, setShowSearch] = useState(false);
  
  // Safe way to try using context
  const boardContext = useContext(BoardContext);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    const isBoardsPage = pathname === '/boards';
    setInBoard(pathname.startsWith('/boards/') && pathname !== '/boards');
    setShowSearch(isBoardsPage);
    
    // Clear search when leaving boards page
    if (!isBoardsPage && boardContext?.setSearchQuery) {
      boardContext.setSearchQuery('');
    }
    
    if (currentUser) {
      const initials = currentUser.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      setUserInitials(initials || 'U');
    }
  }, [pathname, boardContext]);

  const handleAvatarClick = () => {
    router.push('/settings');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href={user ? "/boards" : "/"} className="flex items-center gap-2">
            <span className="text-2xl font-bold italic text-foreground">Murell</span>
          </Link>
          <Link href="/boards" className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-sm bg-muted-foreground" />
              <div className="h-2 w-2 rounded-sm bg-muted-foreground" />
              <div className="h-2 w-2 rounded-sm bg-muted-foreground" />
            </div>
            <span className="font-medium">Boards</span>
          </Link>
        </div>

        <div className="flex-1 max-w-xl mx-8">
          {inBoard ? (
            <Link href="/boards">
              <Button 
                variant="outline" 
                className="w-full h-10 justify-start gap-2"
              >
                <CornerUpLeft />
                <span>Back to Boards</span>
              </Button>
            </Link>
          ) : (
            <div className={`relative ${showSearch ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-200`}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search boards..."
                className="pl-10 bg-background border-border"
                value={boardContext?.searchQuery || ''}
                onChange={(e) => boardContext?.setSearchQuery(e.target.value)}
                disabled={!showSearch}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {/* <Button variant="ghost" size="icon" className="rounded-full">
            <Plus className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button> */}
          <button
            onClick={handleAvatarClick}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            aria-label="Settings"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || undefined} />
              <AvatarFallback className="text-xs font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>
    </header>
  );
};
