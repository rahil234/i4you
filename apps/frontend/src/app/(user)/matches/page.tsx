'use client';

import { useState } from 'react';
import { UserLayout } from '@/components/user-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import useMatchesStore from '@/store/matchesStore';
import { Notifications } from '@/components/user/Notification';

export default function MatchesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { matches } = useMatchesStore();

  const filteredMatches = matches.filter(
    (match) =>
      (match.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (match.user?.location || '').toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <UserLayout>
      <Notifications />
      <div className="max-w-lg mx-auto pb-20 pt-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Your Matches</h1>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search matches..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredMatches.length > 0 ? (
            filteredMatches.map((match) => (
              <div key={match.user.id}
                   className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={match.user.avatar} alt={match.user.name} />
                    <AvatarFallback>{match.user.name}</AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="font-medium">
                      {match.user.name}, {match.user.age}
                    </h3>
                    <p className="text-sm text-muted-foreground">{match.user.location}</p>
                    <p className="text-xs text-muted-foreground">
                      Matched on {new Date(match.createdAt).toLocaleString('en-US', {})}
                    </p>
                  </div>
                </div>

                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" asChild>
                  <Link href={`/messages/${match.user.id}`}>
                    <MessageCircle className="h-5 w-5 text-teal-500" />
                    <span className="sr-only">Message</span>
                  </Link>
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No matches found</p>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
