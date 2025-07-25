import React from 'react';
import { NowProvider } from '@/context/NowContext';
import { ReactQueryProvider } from '@/lib/react-query/provider';

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {

  return (
    <NowProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </NowProvider>
  );
};

export default Layout;