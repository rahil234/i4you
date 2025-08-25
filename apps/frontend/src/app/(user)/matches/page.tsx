'use client';

import { useState } from 'react';
import { UserLayout } from '@/components/user-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MessageCircle, Heart, Clock } from 'lucide-react';
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                Matches
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {filteredMatches.length} {filteredMatches.length === 1 ? 'match' : 'matches'}
              </p>
            </div>
            <div className="bg-gradient-to-r from-pink-500 to-red-500 p-3 rounded-full">
              <Heart className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search your matches..."
              className="pl-10 h-12 rounded-full border-gray-200 bg-gray-50 focus:bg-white transition-colors"
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
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  {/* Avatar with online indicator */}
                  <div className="relative">
                    <Avatar className="h-16 w-16 ring-2 ring-pink-100">
                      <AvatarImage src={match.user.avatar} alt={match.user.name} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-pink-400 to-red-400 text-white font-semibold">
                        {match.user.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online indicator */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-lg text-gray-900 truncate">
                        {match.user.name}
                      </h3>
                      <span className="text-gray-500 font-medium">{match.user.age}</span>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-2 truncate">
                      📍 {match.user.location}
                    </p>
                    
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>
                        Matched {new Date(match.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
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
                    <Link href={`/messages/${match.user.id}`}>
                      <MessageCircle className="h-5 w-5 text-white" />
                      <span className="sr-only">Send message to {match.user.name}</span>
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="bg-gray-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Heart className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No matches found' : 'No matches yet'}
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Keep swiping to find your perfect match! Your matches will appear here.'
                }
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

        {/* Bottom spacing for floating action button if needed */}
        <div className="h-8"></div>
      </div>
    </UserLayout>
  );
}