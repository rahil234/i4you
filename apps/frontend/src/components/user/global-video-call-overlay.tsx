'use client';

import React, { useEffect } from 'react';
import { useVideoCallStore } from '@/store/video-store';
import VideoCall from '@/components/user/video-call';

export default function GlobalVideoCallOverlay() {
  const { init } = useVideoCallStore();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <VideoCall />
  );
}
