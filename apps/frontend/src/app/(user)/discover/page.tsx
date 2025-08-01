'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';
import Logo from '/public/favicon.ico';
import { UserLayout } from '@/components/user-layout';
import useMatchesStore from '@/store/matchesStore';
import { UserProfileCard } from '@/components/user-profile-card';
import { Notifications } from '@/components/user/Notification';
import useAuthStore from '@/store/authStore';

export default function DiscoverPage() {
  const { user } = useAuthStore();
  const { potentialMatches, loading, newMatches, closeMatch } = useMatchesStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchAnimation, setMatchAnimation] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<any>(null);

  useEffect(() => {
    if (newMatches.length > 0) {
      setCurrentMatch(newMatches[0]);
      setMatchAnimation(true);
    } else {
      setMatchAnimation(false);
    }
  }, [newMatches]);

  const handleMatch = (match: any) => {
    setCurrentMatch(match);
    setMatchAnimation(true);
    setTimeout(() => {
      setMatchAnimation(false);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 3000);
  };

  const handleSendMessage = () => {
    if (currentMatch) {
      window.location.href = `/messages/${currentMatch.userId}`;
    }
  };

  useEffect(() => {
    if (currentIndex >= potentialMatches.length && potentialMatches.length > 0) {
      setCurrentIndex(0);
    }
  }, [currentIndex, potentialMatches.length]);

  if (loading) {
    return (
      <UserLayout>
        <Notifications />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Finding people near you...</p>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <Notifications />
      <div className="mb-10 flex justify-between items-center">
        <div className="flex items-center">
          <Image src={Logo} alt="Logo" width="50" height="50" />
          <h1 className="text-2xl text-black font-bold">I4You</h1>
        </div>
      </div>
      <div className="flex flex-col items-center max-w-md mx-auto pt-4 px-4">

        <div className="relative w-full h-[calc(100vh-200px)] flex items-center justify-center">
          <AnimatePresence>
            {potentialMatches.map((user, index) => (
              <UserProfileCard
                key={`${user.id}-${currentIndex + index}`}
                user={user}
                onMatch={index === 0 ? handleMatch : undefined}
              />
            ))}
          </AnimatePresence>

          {potentialMatches.length === 0 || currentIndex >= potentialMatches.length ? (
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">No more profiles</h3>
              <p className="text-gray-500">Check back later for more matches</p>
            </div>
          ) : null}
        </div>

        {/* Match animation */}
        {matchAnimation && currentMatch && (
          <div
            className="fixed inset-0 i4you-gradient flex flex-col items-center justify-center z-50 match-animation"
            onClick={closeMatch}
          >
            <div className="text-center p-8">
              <h2 className="text-4xl font-bold text-white mb-4">It's a Match!</h2>
              <p className="text-xl text-white mb-8">You and {currentMatch?.name} liked each other</p>
              <div className="flex justify-center gap-8">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
                  <img
                    src={user?.avatar}
                    alt="Your profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
                  <img
                    src={currentMatch.photo}
                    alt={currentMatch.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="mt-8 space-y-4">
                <button
                  className="bg-white text-primary px-8 py-3 rounded-full font-semibold shadow-lg w-full"
                  onClick={handleSendMessage}
                >
                  Send a Message
                </button>
                <button
                  className="bg-transparent text-white border border-white px-8 py-3 rounded-full font-semibold w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeMatch();
                  }}
                >
                  Keep Swiping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
