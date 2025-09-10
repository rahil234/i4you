'use client';

import React, { useEffect, useRef } from 'react';

interface CallIncomingProps {
  incoming: { from: { socketId: string; name: string; avatar: string } } | null;
  acceptCall: () => void;
  rejectCall: () => void;
}

export const CallIncoming = ({ incoming, acceptCall, rejectCall }: CallIncomingProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!incoming || !audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
    });
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [incoming]);

  if (!incoming) return null;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] w-[min(92vw,720px)]">
      <audio ref={audioRef} loop autoPlay>
        <source src="/sounds/call-ringtone.mp3" type="audio/mpeg" />
      </audio>
      <div className="flex items-center gap-3 rounded-xl bg-black/80 text-white px-4 py-3 shadow-xl backdrop-blur-sm border border-white/10">
        <img
          src={incoming.from.avatar}
          alt={incoming.from.name}
          className="h-10 w-10 rounded-full object-cover border border-white/20"
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">Incoming video call</div>
          <div className="text-xs text-white/80 truncate">from {incoming.from.name}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => rejectCall()}
            className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium"
            aria-label="Reject call"
          >
            Reject
          </button>
          <button
            onClick={() => acceptCall()}
            className="px-3 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium"
            aria-label="Accept call"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};
