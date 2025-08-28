'use client';

import { useState } from 'react';
import { UserLayout } from '@/components/user-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MessageCircle, Heart, Clock } from 'lucide-react';
import Link from 'next/link';
import useMatchesStore from '@/store/matches-store';
import { Notifications } from '@/components/user/notification';

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
      <div className="min-h-screen bg-background">
        <Notifications />
        <div className="max-w-lg mx-auto pb-20 pt-6 px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1
                  className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                  Matches
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredMatches.length} {filteredMatches.length === 1 ? 'match' : 'matches'}
                </p>
              </div>
              <div className="bg-gradient-to-r from-pink-500 to-red-500 p-3 rounded-full">
                <Heart className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your matches..."
                className="pl-10 h-12 rounded-full border border-border bg-secondary text-foreground focus:bg-background transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Matches Grid */}
          <div className="space-y-4">
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match) => (
                <div
                  key={match.user.id}
                  className="bg-card text-card-foreground rounded-2xl p-4 shadow-sm border border-border hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    {/* Avatar with online indicator */}
                    <div className="relative">
                      <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                        <AvatarImage src={match.user.avatar} alt={match.user.name} className="object-cover" />
                        <AvatarFallback
                          className="bg-gradient-to-br from-pink-400 to-red-400 text-card-foreground font-semibold">
                          {match.user.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className="absolute -bottom-1 -right-1 w-5 h-5 bg-success border-2 border-background rounded-full"></div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-lg truncate">
                          {match.user.name}
                        </h3>
                        <span className="text-muted-foreground font-medium">{match.user.age}</span>
                      </div>

                      <p className="text-sm text-primary mb-2 truncate">
                        📍 {match.user.location}
                      </p>

                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                    Matched {new Date(match.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                  </span>
                      </div>
                    </div>

                    {/* Message Button */}
                    <Button
                      size="icon"
                      className="h-12 w-12 rounded-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      asChild
                    >
                      <Link href={`/messages`}>
                        <MessageCircle className="h-5 w-5 text-white" />
                        <span className="sr-only">Send message to {match.user.name}</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="bg-secondary rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Heart className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {searchQuery ? 'No matches found' : 'No matches yet'}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  {searchQuery
                    ? 'Try adjusting your search terms'
                    : 'Keep swiping to find your perfect match! Your matches will appear here.'}
                </p>
                {!searchQuery && (
                  <Button
                    className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    asChild
                  >
                    <Link href="/discover">
                      Start Swiping
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="h-8"></div>
        </div>
      </div>
    </UserLayout>
  );
}
