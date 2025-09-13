'use client';

import Image from 'next/image';
import {useState, useEffect, useRef} from 'react';
import {AnimatePresence} from 'motion/react';
import {Loader2} from 'lucide-react';
import Logo from '/public/favicon.ico';
import {UserLayout} from '@/components/user-layout';
import {useMatchStore} from '@/store/match-store';
import {UserProfileCard} from '@/components/user-profile-card';
import {Notifications} from '@/components/user/notification';
import {useAuthStore} from '@/store/auth-store';
import {Button} from '@/components/ui/button';
import {useInteractionStore} from "@/store/interaction-store";
import LimitOverlay from "@/components/user/discover/InteractionLimitOverlay";

export default function DiscoverPage() {
    const {user} = useAuthStore();
    const cardRef = useRef<any>(null);
    const {newMatches, closeMatch} = useMatchStore();
    const {loading, potentialMatches} = useInteractionStore();
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
                <Notifications/>
                <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
                    <Loader2 className="h-12 w-12 text-primary animate-spin mb-4"/>
                    <p className="text-muted-foreground">Finding people near you...</p>
                </div>
            </UserLayout>
        );
    }

    const handleLike = async () => (cardRef.current?.like());
    const handleDislike = async () => (cardRef.current?.dislike());
    const handleSuperLike = async () => (cardRef.current?.superLike());

    return (
        <UserLayout>
            <div className="h-full w-full bg-background">
                <Notifications/>
                <div className="mb-10 flex justify-between items-center">
                    <div className="flex items-center">
                        <Image src={Logo} alt="Logo" width="50" height="50"/>
                        <h1 className="text-2xl text-foreground font-bold">I4You</h1>
                    </div>
                </div>
                <div className="flex flex-col items-center max-w-md mx-auto pt-4 px-4">
                    {potentialMatches.length === 0 || currentIndex >= potentialMatches.length ? (
                        <div
                            className="flex  flex-col items-center justify-center text-center h-[calc(92vh-250px)]">
                            <div className="bg-accent rounded-lg shadow-md p-8">
                                <h3 className="text-foreground text-xl font-semibold mb-2">No more profiles</h3>
                                <p className="text-gray-500">Check back later for more matches</p>
                            </div>
                        </div>
                    ) : (<>
                        <div className="relative w-full h-[calc(92vh-250px)] flex items-center justify-center">
                            <AnimatePresence>
                                {potentialMatches.map((user, index) => (
                                    <UserProfileCard
                                        ref={cardRef}
                                        key={`${user.id}-${currentIndex + index}`}
                                        user={user}
                                        onMatch={index === 0 ? handleMatch : undefined}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Action buttons - Enhanced i4you style */}
                        <div className="flex justify-center items-center gap-6 mt-4 px-4">
                            {/* Dislike Button */}
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-16 w-16 rounded-full border-0 bg-white hover:bg-white shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-200 relative overflow-hidden group"
                                onClick={handleDislike}
                            >
                                <div
                                    className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 opacity-10 group-hover:opacity-20 transition-opacity"/>
                                <div className="relative">
                                    <svg
                                        className="h-9 w-9 text-red-500 group-hover:text-red-600 transition-colors"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                    >
                                        <path d="M18 6L6 18M6 6l12 12"/>
                                    </svg>
                                </div>
                                <span className="sr-only">Pass</span>
                            </Button>

                            {/* Super Like Button */}
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-14 w-14 rounded-full border-0 bg-white hover:bg-white shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-200 relative overflow-hidden group"
                                onClick={handleSuperLike}
                            >
                                <div
                                    className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 opacity-10 group-hover:opacity-20 transition-opacity"/>
                                <div className="relative">
                                    <svg
                                        className="h-7 w-7 text-blue-500 group-hover:text-blue-600 transition-colors"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path
                                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <span className="sr-only">Super Like</span>
                            </Button>

                            {/* Like Button */}
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-16 w-16 rounded-full border-0 bg-white hover:bg-white shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-200 relative overflow-hidden group"
                                onClick={handleLike}
                            >
                                <div
                                    className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 opacity-10 group-hover:opacity-20 transition-opacity"/>
                                <div className="relative">
                                    <svg
                                        className="h-9 w-9 text-green-500 group-hover:text-green-600 transition-colors"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path
                                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                    </svg>
                                </div>
                                <span className="sr-only">Like</span>
                            </Button>
                        </div>

                        {/* Action labels */}
                        <div className="flex justify-center items-center gap-6 mt-3 px-4">
                            <span className="text-xs text-gray-500 font-medium w-16 text-center">Pass</span>
                            <span className="text-xs text-gray-500 font-medium w-14 text-center">Super</span>
                            <span className="text-xs text-gray-500 font-medium w-16 text-center">Like</span>
                        </div>
                    </>)}

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

                    <LimitOverlay/>
                </div>
            </div>
        </UserLayout>
    );
}
