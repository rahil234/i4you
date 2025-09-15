'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CircleX } from 'lucide-react';
import matchService from '@/services/match.service';
import { Match } from '@/types';
import { useMatchStore } from '@/store/match-store';

interface BlockedUsersDialogProps {
  open: boolean;
  onClose: () => void;
}

export function BlockedUsersDialog({ open, onClose }: BlockedUsersDialogProps) {
  const [blocked, setBlocked] = useState<Match[]>([]);
  const { reFetchMatches } = useMatchStore();

  useEffect(() => {
    if (open) {
      fetchBlocked();
    }
  }, [open]);

  const fetchBlocked = async () => {
    const { data, error } = await matchService.getBlockedMatches();
    if (error) {
      console.error('Failed to fetch blocked users:', error);
      return;
    }
    setBlocked(data);
  };

  const handleUnblock = async (id: string) => {
    const { error } = await matchService.unblockMatch(id);

    if (error) {
      return;
    }

    await reFetchMatches();

    setBlocked((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Blocked Users</DialogTitle>
          <DialogDescription>
            Manage your blocked users. You can unblock them anytime.
          </DialogDescription>
        </DialogHeader>

        {blocked.length > 0 ? (
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {blocked.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between bg-muted p-3 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={match.user.avatar} />
                    <AvatarFallback>
                      {match.user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{match.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      📍 {match.user.location}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnblock(match.id)}
                  className="flex items-center gap-1"
                >
                  <CircleX className="h-4 w-4" /> Unblock
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No blocked users
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
