'use client';

import React, {forwardRef, useImperativeHandle} from 'react';

import {useState} from 'react';
import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Info} from 'lucide-react';
import {cn} from '@/lib/utils';
import {motion, type PanInfo, useAnimation, useMotionValue, useTransform} from 'motion/react';
import {User} from '@/types';
import {useInteractionStore} from "@/store/interaction-store";

interface UserProfileProps {
    user: User;
    onMatch?: (match: any) => void;
}

export const UserProfileCard = forwardRef(({user}: UserProfileProps, ref) => {
    const {likeUser, superLikeUser, dislikeUser} = useInteractionStore();
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [showInfo, setShowInfo] = useState(false);

    // Framer Motion setup for swipe
    const cardControls = useAnimation();
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-30, 30]);
    const cardOpacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);

    useImperativeHandle(ref, () => ({
        like: handleLike,
        dislike: handleDislike,
        superLike: handleSuperLike,
    }));

    const nextPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentPhotoIndex < user.photos.length - 1) {
            setCurrentPhotoIndex((prev) => prev + 1);
        }
    };

    const prevPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentPhotoIndex > 0) {
            setCurrentPhotoIndex((prev) => prev - 1);
        }
    };

    const handleDragEnd = async (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 100;

        if (info.offset.x > threshold) {
            // Swiped right - like
            await handleLike()
        } else if (info.offset.x < -threshold) {
            // Swiped left - dislike
            await handleDislike()
        } else {
            await cardControls.start({
                x: 0,
                opacity: 1,
                transition: {type: 'spring', stiffness: 300, damping: 20},
            });
        }
    };

    const centerCard = async () => {
        await cardControls.start({
            x: 0,
            y: 0,
            opacity: 1,
            transition: {duration: 0.3},
        });
    };

    const handleLike = async () => {
        await cardControls.start({
            x: 500,
            opacity: 0,
            transition: {duration: 0.3},
        });

        const status = await likeUser(user.id);
        if (!status) {
            await centerCard();
        }
    };

    const handleSuperLike = async () => {
        await cardControls.start({
            y: -500,
            opacity: 0,
            transition: {duration: 0.3},
        });

        const status = await superLikeUser(user.id);
        if (!status) {
            await centerCard();
        }
    };


    const handleDislike = async () => {
        await cardControls.start({
            x: -500,
            opacity: 0,
            transition: {duration: 0.3},
        });

        const status = await dislikeUser(user.id);
        if (!status) {
            await centerCard();
        }
    };


    const toggleInfo = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowInfo(!showInfo);
    };

    return (
        <>
            <motion.div
                className="absolute w-full max-w-sm mx-auto"
                animate={cardControls}
                drag="x"
                dragConstraints={{left: 0, right: 0}}
                onDragEnd={handleDragEnd}
                style={{x, rotate, opacity: cardOpacity}}
            >
                <Card
                    className="overflow-hidden shadow-xl rounded-xl border-0 h-[70vh] max-h-[600px] relative i4you-card-shadow">
                    <div className="relative h-full w-full bg-black">
                        <img
                            src={user.photos[currentPhotoIndex] || '/placeholder.svg'}
                            alt={`${user.name}'s photo`}
                            className="object-cover w-full h-full"
                        />

                        {/* Photo navigation */}
                        <div className="absolute top-0 left-0 right-0 flex justify-between h-full">
                            <div className="w-1/3 h-full cursor-pointer" onClick={prevPhoto}></div>
                            <div className="w-1/3 h-full cursor-pointer" onClick={toggleInfo}></div>
                            <div className="w-1/3 h-full cursor-pointer" onClick={nextPhoto}></div>
                        </div>

                        Photo indicators
                        <div className="absolute top-2 left-0 right-0 flex justify-center gap-1 px-2">
                            {user.photos.map((_, index) => (
                                <div
                                    key={index}
                                    className={cn('h-1 flex-1 rounded-full', index === currentPhotoIndex ? 'bg-white' : 'bg-white/40')}
                                />
                            ))}
                        </div>

                        Distance badge
                        <div className="absolute top-4 left-4 bg-black/40 text-white px-2 py-1 rounded-full text-xs">
                            {user.distance} away
                        </div>

                        {/* User info overlay */}
                        <div
                            className={cn(
                                'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 text-white transition-all duration-300',
                                showInfo ? 'h-3/4' : 'h-auto',
                            )}
                        >
                            <div className="flex items-end justify-between mb-2">
                                <h3 className="text-2xl font-bold">
                                    {user.name}, {user.age}
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-white hover:bg-white/20 h-8 w-8 rounded-full"
                                    onClick={toggleInfo}
                                >
                                    <Info className="h-5 w-5"/>
                                </Button>
                            </div>
                            <p className="text-sm text-white/80 mb-2">{user.location}</p>

                            {showInfo && (
                                <div className="space-y-4 overflow-y-auto max-h-[calc(100%-80px)]">
                                    <p className="text-sm text-white/90">{user.bio}</p>

                                    <div>
                                        <h4 className="text-sm font-semibold mb-2">Interests</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {user.interests?.length && user.interests.map((interest, index) => (
                                                <span key={index}
                                                      className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                        {interest}
                      </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </motion.div>
        </>
    );
});
