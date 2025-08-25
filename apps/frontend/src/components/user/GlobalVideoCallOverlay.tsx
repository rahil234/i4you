'use client';

import React, { useEffect } from 'react';
import { useVideoCallStore } from '@/store/videoStore';
import VideoCall from '@/components/user/VideoCall';

export default function GlobalVideoCallOverlay() {
  const { init } = useVideoCallStore();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <VideoCall />
  );
}
