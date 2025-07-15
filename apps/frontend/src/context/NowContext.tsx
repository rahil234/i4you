'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const NowContext = createContext<number>(Date.now());

export const useNow = () => useContext(NowContext);

export const NowProvider = ({ children }: { children: React.ReactNode }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return <NowContext.Provider value={now}>{children}</NowContext.Provider>;
};